/**
 * Scrizians Real-Time Data Sync Engine
 * Canonical dataset, version control migration, and synchronization layer connecting website forms, public pages, Admin CRM, and Contributor portals.
 */

import { addNotification } from './notificationSync';

const CURRENT_DATA_VERSION = 'scrizians_v4_unified_2026';

export const initialLeadsList: any[] = [];
export const initialTalentList: any[] = [];
export const initialJobsList: any[] = [];
export const initialArticlesList: any[] = [];

export const getStoredData = (key: string, fallback: any[]) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    if (data === null) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
};

export const syncFromMongoDB = (key: string) => {
  if (typeof window === 'undefined') return;
  const routeMap: Record<string, string> = {
    scrizians_leads_list: 'leads',
    scrizians_talent_list: 'talent',
    scrizians_jobs_list: 'jobs',
    scrizians_insights_list: 'insights'
  };

  const route = routeMap[key];
  if (!route) return;

  fetch(`/api/${route}`, { cache: 'no-store' })
    .then(res => res.json())
    .then(resData => {
      if (resData.success && Array.isArray(resData.data)) {
        const newDataStr = JSON.stringify(resData.data);
        const currentDataStr = localStorage.getItem(key);
        if (newDataStr !== currentDataStr) {
          localStorage.setItem(key, newDataStr);
          window.dispatchEvent(new Event('scrizians_storage_updated'));
        }
      }
    })
    .catch(err => {
      console.warn(`MongoDB ${route} sync error:`, err);
    });
};

export const syncAllFromMongoDB = () => {
  if (typeof window === 'undefined') return;
  syncFromMongoDB('scrizians_leads_list');
  syncFromMongoDB('scrizians_talent_list');
  syncFromMongoDB('scrizians_jobs_list');
  syncFromMongoDB('scrizians_insights_list');
};

export const saveStoredData = (key: string, data: any[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('scrizians_storage_updated'));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

export const deleteStoredData = (key: string, id: string, updatedList: any[]) => {
  if (typeof window === 'undefined') return;
  saveStoredData(key, updatedList);

  const routeMap: Record<string, string> = {
    scrizians_leads_list: 'leads',
    scrizians_talent_list: 'talent',
    scrizians_jobs_list: 'jobs',
    scrizians_insights_list: 'insights'
  };

  const route = routeMap[key];
  if (route) {
    fetch(`/api/${route}?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(err => {
      console.warn('MongoDB Delete error:', err);
    });
  }
};

export const addInboundLead = (leadData: Partial<typeof initialLeadsList[0]>) => {
  if (typeof window === 'undefined') return;
  
  let currentLeads = getStoredData('scrizians_leads_list', initialLeadsList);
  
  if (!Array.isArray(currentLeads)) {
    currentLeads = [];
  }

  const newLead = {
    _id: `lead-${Date.now()}`,
    name: leadData.name || 'Anonymous Inquiry',
    email: leadData.email || 'contact@client.com',
    phone: leadData.phone || '+1 (555) 000-0000',
    company: leadData.company || 'Enterprise Client',
    serviceRequested: leadData.serviceRequested || 'Talent Requirement Inquiry',
    scrizianIdReferenced: leadData.scrizianIdReferenced || 'N/A',
    stage: 'New Inbound Lead',
    message: leadData.message || 'Inbound request submitted via website.',
    createdAt: new Date().toISOString()
  };

  const updated = [newLead, ...currentLeads];
  saveStoredData('scrizians_leads_list', updated);

  fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newLead)
  }).catch(err => console.warn('MongoDB Lead POST error:', err));

  addNotification({
    title: '⚡ New Inbound Client Lead',
    message: `${newLead.name} (${newLead.company}) submitted a new inquiry.`,
    type: 'lead',
    link: '/dashboard/admin'
  });

  return newLead;
};
