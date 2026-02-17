'use client';

import styled from 'styled-components';

export const DetailsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 2fr 1fr;
  }
`;

export const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const ImageGallery = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
`;

export const MainImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
`;

export const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const Thumbnail = styled.img<{ $active?: boolean }>`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  opacity: ${({ $active }) => ($active ? 1 : 0.6)};
  border: 2px solid ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ProjectName = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

export const UnitNumber = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.7;
`;

export const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const SpecItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const SpecLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
`;

export const SpecValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

export const FeaturesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const FeatureTag = styled.span`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.colors.backgroundAlt};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export const PriceCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  position: sticky;
  top: 80px;
`;

export const PriceLabel = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;

export const Price = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin: ${({ theme }) => `${theme.spacing.xs} 0 ${theme.spacing.lg}`};
`;

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ $status }) => {
    switch ($status) {
      case 'AVAILABLE':
        return 'rgba(34, 197, 94, 0.1)';
      case 'RESERVED':
        return 'rgba(245, 158, 11, 0.1)';
      case 'SOLD':
        return 'rgba(239, 68, 68, 0.1)';
      default:
        return 'rgba(100, 116, 139, 0.1)';
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case 'AVAILABLE':
        return '#16a34a';
      case 'RESERVED':
        return '#d97706';
      case 'SOLD':
        return '#dc2626';
      default:
        return '#64748b';
    }
  }};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const BackLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-decoration: none;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Section = styled.section`
  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;
