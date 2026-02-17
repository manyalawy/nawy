'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Apartment } from '@/types/apartment';
import { Button } from '@/components/common/Button';
import {
  DetailsWrapper,
  MainSection,
  Sidebar,
  ImageGallery,
  MainImage,
  ThumbnailGrid,
  Thumbnail,
  Header,
  ProjectName,
  Title,
  UnitNumber,
  Description,
  SpecsGrid,
  SpecItem,
  SpecLabel,
  SpecValue,
  FeaturesGrid,
  FeatureTag,
  PriceCard,
  PriceLabel,
  Price,
  StatusBadge,
  BackLink,
  Section,
} from './styles';

interface ApartmentDetailsProps {
  apartment: Apartment;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(price);
}

export function ApartmentDetails({ apartment }: ApartmentDetailsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = apartment.images.length > 0
    ? apartment.images
    : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'];

  return (
    <>
      <Link href="/apartments" passHref legacyBehavior>
        <BackLink>&larr; Back to Apartments</BackLink>
      </Link>

      <DetailsWrapper>
        <MainSection>
          <ImageGallery>
            <MainImage src={images[selectedImageIndex]} alt={apartment.unitName} />
            {images.length > 1 && (
              <ThumbnailGrid>
                {images.map((image, index) => (
                  <Thumbnail
                    key={index}
                    src={image}
                    alt={`${apartment.unitName} - Image ${index + 1}`}
                    $active={index === selectedImageIndex}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </ThumbnailGrid>
            )}
          </ImageGallery>

          <Header>
            {apartment.project && <ProjectName>{apartment.project.name}</ProjectName>}
            <Title>{apartment.unitName}</Title>
            <UnitNumber>Unit: {apartment.unitNumber}</UnitNumber>
          </Header>

          <Section>
            <h2>Specifications</h2>
            <SpecsGrid>
              <SpecItem>
                <SpecLabel>Bedrooms</SpecLabel>
                <SpecValue>{apartment.bedrooms}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Bathrooms</SpecLabel>
                <SpecValue>{apartment.bathrooms}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Area</SpecLabel>
                <SpecValue>{apartment.area} m²</SpecValue>
              </SpecItem>
              {apartment.floor && (
                <SpecItem>
                  <SpecLabel>Floor</SpecLabel>
                  <SpecValue>{apartment.floor}</SpecValue>
                </SpecItem>
              )}
            </SpecsGrid>
          </Section>

          {apartment.description && (
            <Section>
              <h2>Description</h2>
              <Description>{apartment.description}</Description>
            </Section>
          )}

          {apartment.features.length > 0 && (
            <Section>
              <h2>Features & Amenities</h2>
              <FeaturesGrid>
                {apartment.features.map((feature, index) => (
                  <FeatureTag key={index}>{feature}</FeatureTag>
                ))}
              </FeaturesGrid>
            </Section>
          )}

          {apartment.project && (
            <Section>
              <h2>Project Details</h2>
              <p><strong>Project:</strong> {apartment.project.name}</p>
              <p><strong>Location:</strong> {apartment.project.location}</p>
              {apartment.project.developer && (
                <p><strong>Developer:</strong> {apartment.project.developer}</p>
              )}
              {apartment.project.description && (
                <p>{apartment.project.description}</p>
              )}
            </Section>
          )}
        </MainSection>

        <Sidebar>
          <PriceCard>
            <StatusBadge $status={apartment.status}>{apartment.status}</StatusBadge>
            <PriceLabel>Price</PriceLabel>
            <Price>{formatPrice(apartment.price)}</Price>
            {apartment.status === 'AVAILABLE' && (
              <Button fullWidth size="lg">
                Contact Agent
              </Button>
            )}
          </PriceCard>
        </Sidebar>
      </DetailsWrapper>
    </>
  );
}
