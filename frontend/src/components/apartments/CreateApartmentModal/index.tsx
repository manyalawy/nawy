'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { api } from '@/lib/api';
import { Project } from '@/types/apartment';
import { Form, FormGrid, ErrorAlert, ButtonRow } from './styles';

interface CreateApartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateApartmentModal({ isOpen, onClose, onSuccess }: CreateApartmentModalProps) {
  const [formData, setFormData] = useState({
    unitName: '',
    unitNumber: '',
    projectId: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    description: '',
    features: '',
    images: '',
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);

  const loadProjects = async () => {
    try {
      const response = await api.getProjects();
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.unitName.trim()) errors.unitName = 'Unit name is required';
    if (!formData.unitNumber.trim()) errors.unitNumber = 'Unit number is required';
    if (!formData.projectId) errors.projectId = 'Project is required';
    if (!formData.price || Number(formData.price) <= 0) errors.price = 'Valid price is required';
    if (!formData.area || Number(formData.area) <= 0) errors.area = 'Valid area is required';
    if (!formData.bedrooms || Number(formData.bedrooms) < 0)
      errors.bedrooms = 'Valid bedrooms count is required';
    if (!formData.bathrooms || Number(formData.bathrooms) < 0)
      errors.bathrooms = 'Valid bathrooms count is required';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    const payload = {
      unitName: formData.unitName.trim(),
      unitNumber: formData.unitNumber.trim(),
      projectId: formData.projectId,
      price: Number(formData.price),
      area: Number(formData.area),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      ...(formData.floor && { floor: Number(formData.floor) }),
      ...(formData.description && { description: formData.description.trim() }),
      ...(formData.features && {
        features: formData.features
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean),
      }),
      ...(formData.images && {
        images: formData.images
          .split(',')
          .map((i) => i.trim())
          .filter(Boolean),
      }),
    };

    try {
      await api.createApartment(payload);
      resetForm();
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create apartment');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      unitName: '',
      unitNumber: '',
      projectId: '',
      price: '',
      area: '',
      bedrooms: '',
      bathrooms: '',
      floor: '',
      description: '',
      features: '',
      images: '',
    });
    setError(null);
    setFieldErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Apartment">
      {error && <ErrorAlert>{error}</ErrorAlert>}
      <Form onSubmit={handleSubmit}>
        <FormGrid>
          <Input
            label="Unit Name *"
            id="unitName"
            name="unitName"
            value={formData.unitName}
            onChange={handleChange}
            error={fieldErrors.unitName}
            placeholder="e.g., Skyline Suite A"
          />
          <Input
            label="Unit Number *"
            id="unitNumber"
            name="unitNumber"
            value={formData.unitNumber}
            onChange={handleChange}
            error={fieldErrors.unitNumber}
            placeholder="e.g., TG-1501"
          />
        </FormGrid>

        <Select
          label="Project *"
          id="projectId"
          name="projectId"
          value={formData.projectId}
          onChange={handleChange}
          error={fieldErrors.projectId}
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name} - {project.location}
            </option>
          ))}
        </Select>

        <FormGrid>
          <Input
            label="Price (EGP) *"
            id="price"
            name="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={handleChange}
            error={fieldErrors.price}
            placeholder="e.g., 4500000"
          />
          <Input
            label="Area (sqm) *"
            id="area"
            name="area"
            type="number"
            min="0"
            value={formData.area}
            onChange={handleChange}
            error={fieldErrors.area}
            placeholder="e.g., 180"
          />
        </FormGrid>

        <FormGrid>
          <Input
            label="Bedrooms *"
            id="bedrooms"
            name="bedrooms"
            type="number"
            min="0"
            value={formData.bedrooms}
            onChange={handleChange}
            error={fieldErrors.bedrooms}
            placeholder="e.g., 3"
          />
          <Input
            label="Bathrooms *"
            id="bathrooms"
            name="bathrooms"
            type="number"
            min="0"
            value={formData.bathrooms}
            onChange={handleChange}
            error={fieldErrors.bathrooms}
            placeholder="e.g., 2"
          />
        </FormGrid>

        <Input
          label="Floor"
          id="floor"
          name="floor"
          type="number"
          min="0"
          value={formData.floor}
          onChange={handleChange}
          placeholder="e.g., 15"
        />

        <Textarea
          label="Description"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter apartment description"
          rows={3}
        />

        <Textarea
          label="Features (comma-separated)"
          id="features"
          name="features"
          value={formData.features}
          onChange={handleChange}
          placeholder="e.g., Pool, Gym, Parking, Balcony"
          rows={2}
        />

        <Textarea
          label="Image URLs (comma-separated)"
          id="images"
          name="images"
          value={formData.images}
          onChange={handleChange}
          placeholder="e.g., https://example.com/image1.jpg, https://example.com/image2.jpg"
          rows={2}
        />

        <ButtonRow>
          <Button variant="secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Apartment
          </Button>
        </ButtonRow>
      </Form>
    </Modal>
  );
}
