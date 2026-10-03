import { api } from './api';

export interface DocumentItem {
  id: string;
  userId: string;
  applicationId?: string | null;
  title: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
  createdAt: string;
  application?: {
    id: string;
    companyName: string;
    position: string;
  } | null;
}

export const documentService = {
  getDocuments: (fileType?: string) =>
    api.get<{ data: DocumentItem[] }>('/documents', { params: { fileType } }),

  uploadDocument: (formData: FormData) =>
    api.post<{ data: DocumentItem }>('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteDocument: (id: string) =>
    api.delete(`/documents/${id}`),
};
