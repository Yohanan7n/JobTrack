import React, { useState, useEffect } from 'react';
import { companyService, Company } from '../services/company.service';
import { CompanyModal } from '../components/companies/CompanyModal';
import { Button } from '../components/common/Button';
import {
  Building2,
  ExternalLink,
  MapPin,
  Mail,
  User,
  Plus,
  Search,
  Briefcase,
} from 'lucide-react';

export const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const res = await companyService.getCompanies(search);
      setCompanies(res.data.data);
    } catch (err) {
      console.error('Failed to load companies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [search]);

  const handleSaveCompany = async (data: Partial<Company>) => {
    if (selectedCompany) {
      await companyService.updateCompany(selectedCompany.id, data);
    } else {
      await companyService.createCompany(data);
    }
    fetchCompanies();
  };

  const handleDeleteCompany = async (id: string) => {
    await companyService.deleteCompany(id);
    fetchCompanies();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-outfit">
            Target Companies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Directory of tech companies, recruiters, contacts, and application histories.
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedCompany(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Company
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by company name, industry, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
        />
      </div>

      {/* Companies Grid */}
      {companies.length === 0 && !isLoading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No companies found</h3>
          <p className="text-xs text-slate-500 mt-1">Add companies as you apply to positions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-400/80 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold font-outfit text-sm">
                      {company.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {company.name}
                      </h3>
                      {company.industry && (
                        <span className="text-[11px] text-slate-500 font-medium">
                          {company.industry}
                        </span>
                      )}
                    </div>
                  </div>

                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
                      title="Visit company website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Location */}
                {company.location && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{company.location}</span>
                  </div>
                )}

                {/* Recruiter / Contact */}
                {(company.contactPerson || company.contactEmail) && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                    {company.contactPerson && (
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-800">{company.contactPerson}</span>
                      </div>
                    )}
                    {company.contactEmail && (
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{company.contactEmail}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Notes */}
                {company.notes && (
                  <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {company.notes}
                  </p>
                )}
              </div>

              {/* Card Footer: Applications count & Edit action */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                  <strong className="text-slate-800">{company.applicationCount || 0}</strong> active role(s)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedCompany(company);
                      setIsModalOpen(true);
                    }}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 transition-all duration-200"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Company Modal */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCompany}
        onDelete={handleDeleteCompany}
        initialData={selectedCompany}
      />
    </div>
  );
};
