"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export interface JobFilters {
  query: string;
  status: string;
  category: string;
  location: string;
  company: string;
}

interface JobFilterToolbarProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  onReset: () => void;
}

export function JobFilterToolbar({ filters, onFiltersChange, onReset }: JobFilterToolbarProps) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border bg-card p-4 md:grid-cols-6">
      <Input
        placeholder="Search title/company/keyword"
        value={filters.query}
        onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
        className="md:col-span-2"
      />

      <Select value={filters.status} onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}>
        <option value="all">All status</option>
        <option value="draft">Draft</option>
        <option value="submitted">Submitted</option>
        <option value="under_review">Under review</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="published">Published</option>
        <option value="expired">Expired</option>
        <option value="archived">Archived</option>
      </Select>

      <Input
        placeholder="Category"
        value={filters.category}
        onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
      />

      <Input
        placeholder="Location"
        value={filters.location}
        onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
      />

      <div className="flex gap-2">
        <Input
          placeholder="Company"
          value={filters.company}
          onChange={(e) => onFiltersChange({ ...filters, company: e.target.value })}
        />
        <Button variant="outline" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
