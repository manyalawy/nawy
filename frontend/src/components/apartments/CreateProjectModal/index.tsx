'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Button } from '@/components/common/Button';
import { api } from '@/lib/api';
import { Form, ErrorAlert, ButtonRow } from './styles';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    developer: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Project name is required';
    if (!formData.location.trim()) errors.location = 'Location is required';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    const payload = {
      name: formData.name.trim(),
      location: formData.location.trim(),
      ...(formData.developer && { developer: formData.developer.trim() }),
      ...(formData.description && { description: formData.description.trim() }),
    };

    try {
      await api.createProject(payload);
      setFormData({ name: '', location: '', developer: '', description: '' });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', location: '', developer: '', description: '' });
    setError(null);
    setFieldErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Project">
      {error && <ErrorAlert>{error}</ErrorAlert>}
      <Form onSubmit={handleSubmit}>
        <Input
          label="Project Name *"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={fieldErrors.name}
          placeholder="Enter project name"
        />
        <Input
          label="Location *"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          error={fieldErrors.location}
          placeholder="Enter location"
        />
        <Input
          label="Developer"
          id="developer"
          name="developer"
          value={formData.developer}
          onChange={handleChange}
          placeholder="Enter developer name"
        />
        <Textarea
          label="Description"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter project description"
          rows={3}
        />
        <ButtonRow>
          <Button variant="secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Project
          </Button>
        </ButtonRow>
      </Form>
    </Modal>
  );
}
