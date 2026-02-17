'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Apartment } from '@/types/apartment';
import {
  CardWrapper,
  ImageContainer,
  Image,
  StatusBadge,
  CardContent,
  ProjectName,
  UnitName,
  Price,
  SpecsRow,
  Spec,
} from './styles';

interface ApartmentCardProps {
  apartment: Apartment;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(price);
}

export function ApartmentCard({ apartment }: ApartmentCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/apartments/${apartment.id}`);
  };

  const imageUrl = apartment.images[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800';

  return (
    <CardWrapper onClick={handleClick}>
      <ImageContainer>
        <Image src={imageUrl} alt={apartment.unitName} />
        <StatusBadge $status={apartment.status}>{apartment.status}</StatusBadge>
      </ImageContainer>
      <CardContent>
        {apartment.project && <ProjectName>{apartment.project.name}</ProjectName>}
        <UnitName>{apartment.unitName}</UnitName>
        <Price>{formatPrice(apartment.price)}</Price>
        <SpecsRow>
          <Spec>{apartment.bedrooms} Beds</Spec>
          <Spec>{apartment.bathrooms} Baths</Spec>
          <Spec>{apartment.area} m²</Spec>
          {apartment.floor && <Spec>Floor {apartment.floor}</Spec>}
        </SpecsRow>
      </CardContent>
    </CardWrapper>
  );
}
