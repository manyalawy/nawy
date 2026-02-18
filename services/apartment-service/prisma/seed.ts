import { PrismaClient } from '@prisma/client';
import { MeiliSearch } from 'meilisearch';

const prisma = new PrismaClient();

async function seedMeilisearch() {
  const meilisearchUrl = process.env.MEILISEARCH_URL || 'http://localhost:7700';
  const meilisearchKey = process.env.MEILISEARCH_MASTER_KEY;

  if (!meilisearchKey) {
    console.log('Skipping Meilisearch indexing (MEILISEARCH_MASTER_KEY not set)');
    return;
  }

  try {
    const client = new MeiliSearch({
      host: meilisearchUrl,
      apiKey: meilisearchKey,
    });

    // Check health
    await client.health();
    console.log('Connected to Meilisearch');

    const apartments = await prisma.apartment.findMany({
      include: { project: true },
    });

    const documents = apartments.map((apt) => ({
      id: apt.id,
      unitName: apt.unitName,
      unitNumber: apt.unitNumber,
      description: apt.description,
      features: apt.features,
      projectId: apt.projectId,
      projectName: apt.project.name,
      projectLocation: apt.project.location,
      projectDeveloper: apt.project.developer,
      price: Number(apt.price),
      area: Number(apt.area),
      bedrooms: apt.bedrooms,
      bathrooms: apt.bathrooms,
      floor: apt.floor,
      status: apt.status,
      createdAt: new Date(apt.createdAt).getTime(),
      images: apt.images,
    }));

    // Create index with settings if needed
    try {
      await client.createIndex('apartments', { primaryKey: 'id' });
    } catch {
      // Index may already exist
    }

    const index = client.index('apartments');

    // Configure index settings
    await index.updateSettings({
      searchableAttributes: [
        'unitName',
        'unitNumber',
        'description',
        'features',
        'projectName',
        'projectLocation',
        'projectDeveloper',
      ],
      filterableAttributes: [
        'projectId',
        'bedrooms',
        'bathrooms',
        'price',
        'area',
        'floor',
        'status',
      ],
      sortableAttributes: ['price', 'area', 'bedrooms', 'createdAt'],
    });

    // Clear and reindex
    await index.deleteAllDocuments();
    await index.addDocuments(documents);

    console.log(`Indexed ${documents.length} apartments to Meilisearch`);
  } catch (error) {
    console.log('Meilisearch indexing skipped:', (error as Error).message);
  }
}

async function main() {
  // Create Projects
  const projects = await Promise.all([
    prisma.project.upsert({
      where: { name: 'The Gate Residence' },
      update: {},
      create: {
        name: 'The Gate Residence',
        description: 'Luxury high-rise apartments in the heart of New Cairo with stunning city views',
        location: 'New Cairo, Egypt',
        developer: 'Palm Hills Developments',
      },
    }),
    prisma.project.upsert({
      where: { name: 'Zed East' },
      update: {},
      create: {
        name: 'Zed East',
        description: 'Modern living spaces with world-class amenities and green landscapes',
        location: 'New Cairo, Egypt',
        developer: 'Ora Developers',
      },
    }),
    prisma.project.upsert({
      where: { name: 'Mountain View iCity' },
      update: {},
      create: {
        name: 'Mountain View iCity',
        description: 'Contemporary apartments in a smart city environment',
        location: 'October City, Egypt',
        developer: 'Mountain View',
      },
    }),
    prisma.project.upsert({
      where: { name: 'Sodic East' },
      update: {},
      create: {
        name: 'Sodic East',
        description: 'Premium residential community with integrated lifestyle facilities',
        location: 'New Heliopolis, Egypt',
        developer: 'SODIC',
      },
    }),
  ]);

  // Create Apartments
  const apartmentData = [
    {
      unitName: 'Skyline Suite A',
      unitNumber: 'TG-1501',
      projectId: projects[0].id,
      price: 4500000,
      area: 180,
      bedrooms: 3,
      bathrooms: 2,
      floor: 15,
      description: 'Luxurious 3-bedroom suite with panoramic city views and premium finishes',
      features: ['Balcony', 'City View', 'Smart Home', 'Parking', 'Gym Access'],
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ],
      status: 'AVAILABLE' as const,
    },
    {
      unitName: 'Garden View Studio',
      unitNumber: 'TG-0312',
      projectId: projects[0].id,
      price: 1800000,
      area: 65,
      bedrooms: 1,
      bathrooms: 1,
      floor: 3,
      description: 'Cozy studio apartment overlooking the community gardens',
      features: ['Garden View', 'Parking', 'Gym Access'],
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      ],
      status: 'AVAILABLE' as const,
    },
    {
      unitName: 'Executive Penthouse',
      unitNumber: 'ZE-PH01',
      projectId: projects[1].id,
      price: 12000000,
      area: 350,
      bedrooms: 4,
      bathrooms: 4,
      floor: 20,
      description: 'Exclusive penthouse with private terrace and 360-degree views',
      features: ['Private Terrace', 'Pool', 'Smart Home', 'Private Elevator', 'Concierge'],
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      ],
      status: 'RESERVED' as const,
    },
    {
      unitName: 'Family Duplex',
      unitNumber: 'ZE-0845',
      projectId: projects[1].id,
      price: 5500000,
      area: 220,
      bedrooms: 4,
      bathrooms: 3,
      floor: 8,
      description: 'Spacious duplex perfect for families with private garden access',
      features: ['Duplex', 'Private Garden', 'Parking', 'Storage Room', 'Maid Room'],
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      ],
      status: 'AVAILABLE' as const,
    },
    {
      unitName: 'Smart Living Unit',
      unitNumber: 'MV-1205',
      projectId: projects[2].id,
      price: 3200000,
      area: 145,
      bedrooms: 2,
      bathrooms: 2,
      floor: 12,
      description: 'Modern 2-bedroom apartment with full smart home integration',
      features: ['Smart Home', 'City View', 'Gym Access', 'Co-working Space Access'],
      images: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      ],
      status: 'AVAILABLE' as const,
    },
    {
      unitName: 'Compact Studio',
      unitNumber: 'MV-0412',
      projectId: projects[2].id,
      price: 1200000,
      area: 55,
      bedrooms: 1,
      bathrooms: 1,
      floor: 4,
      description: 'Efficient studio for young professionals',
      features: ['Smart Home', 'Parking', 'Gym Access'],
      images: [
        'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800',
      ],
      status: 'SOLD' as const,
    },
    {
      unitName: 'Premium Corner Unit',
      unitNumber: 'SE-0920',
      projectId: projects[3].id,
      price: 6800000,
      area: 240,
      bedrooms: 3,
      bathrooms: 3,
      floor: 9,
      description: 'Corner unit with extra windows and natural lighting throughout',
      features: ['Corner Unit', 'Extra Windows', 'Balcony', 'Parking', 'Pool Access'],
      images: [
        'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
      ],
      status: 'AVAILABLE' as const,
    },
    {
      unitName: 'Garden Apartment',
      unitNumber: 'SE-G105',
      projectId: projects[3].id,
      price: 4200000,
      area: 175,
      bedrooms: 2,
      bathrooms: 2,
      floor: 1,
      description: 'Ground floor apartment with direct garden access',
      features: ['Private Garden', 'Pets Allowed', 'Parking', 'Storage'],
      images: [
        'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800',
      ],
      status: 'AVAILABLE' as const,
    },
  ];

  // Delete existing apartments and create new ones
  await prisma.apartment.deleteMany({});

  for (const apartment of apartmentData) {
    await prisma.apartment.create({
      data: apartment,
    });
  }

  console.log('Seed data created successfully!');
  console.log(`Created ${projects.length} projects`);
  console.log(`Created ${apartmentData.length} apartments`);

  // Index to Meilisearch
  await seedMeilisearch();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
