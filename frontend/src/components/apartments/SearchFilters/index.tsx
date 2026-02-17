'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { FilterParams, Project } from '@/types/apartment';
import { api } from '@/lib/api';

const FiltersWrapper = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;

interface SearchFiltersProps {
  filters: FilterParams;
  onFiltersChange: (filters: FilterParams) => void;
}

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [localFilters, setLocalFilters] = useState<FilterParams>(filters);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await api.getProjects();
        setProjects(response.data);
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    };
    loadProjects();
  }, []);

  const handleChange = (key: keyof FilterParams, value: string | number | undefined) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onFiltersChange({ ...localFilters, page: 1 });
  };

  const handleReset = () => {
    const resetFilters: FilterParams = { page: 1, limit: 12 };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <FiltersWrapper>
      <FiltersGrid>
        <Input
          label="Search"
          placeholder="Search apartments..."
          value={localFilters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
        />

        <SelectWrapper>
          <Label>Project</Label>
          <Select
            value={localFilters.projectId || ''}
            onChange={(e) => handleChange('projectId', e.target.value || undefined)}
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </Select>
        </SelectWrapper>

        <SelectWrapper>
          <Label>Bedrooms</Label>
          <Select
            value={localFilters.bedrooms ?? ''}
            onChange={(e) =>
              handleChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)
            }
          >
            <option value="">Any</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4+</option>
          </Select>
        </SelectWrapper>

        <SelectWrapper>
          <Label>Price Range</Label>
          <Select
            value={
              localFilters.minPrice !== undefined || localFilters.maxPrice !== undefined
                ? `${localFilters.minPrice || ''}-${localFilters.maxPrice || ''}`
                : ''
            }
            onChange={(e) => {
              if (!e.target.value) {
                handleChange('minPrice', undefined);
                handleChange('maxPrice', undefined);
              } else {
                const [min, max] = e.target.value.split('-').map(Number);
                setLocalFilters((prev) => ({
                  ...prev,
                  minPrice: min || undefined,
                  maxPrice: max || undefined,
                }));
              }
            }}
          >
            <option value="">Any Price</option>
            <option value="0-2000000">Under 2M EGP</option>
            <option value="2000000-5000000">2M - 5M EGP</option>
            <option value="5000000-10000000">5M - 10M EGP</option>
            <option value="10000000-">Above 10M EGP</option>
          </Select>
        </SelectWrapper>
      </FiltersGrid>

      <ButtonsRow>
        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={handleSearch}>Search</Button>
      </ButtonsRow>
    </FiltersWrapper>
  );
}
