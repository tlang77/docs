import { PrismaClient, PropertyType, PropertyStatus } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Create 2 agent users
  const agentUser1 = await prisma.user.upsert({
    where: { email: 'sarah.miller@mountainretreatrealty.com' },
    update: {},
    create: {
      email: 'sarah.miller@mountainretreatrealty.com',
      name: 'Sarah Miller',
      role: 'AGENT',
      hashedPassword: await bcrypt.hash('agent123', 10),
      agent: {
        create: {
          licenseNum: 'CO-RE-100234',
          phone: '(970) 555-0101',
          title: 'Senior Associate',
          bio: 'Sarah has 12 years of experience specializing in luxury mountain properties across Aspen, Telluride, and Breckenridge. She has closed over $80M in transactions and is known for her deep knowledge of Colorado ski resort markets.',
          photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
        },
      },
    },
    include: { agent: true },
  })

  const agentUser2 = await prisma.user.upsert({
    where: { email: 'james.chen@mountainretreatrealty.com' },
    update: {},
    create: {
      email: 'james.chen@mountainretreatrealty.com',
      name: 'James Chen',
      role: 'AGENT',
      hashedPassword: await bcrypt.hash('agent123', 10),
      agent: {
        create: {
          licenseNum: 'CO-RE-100891',
          phone: '(970) 555-0182',
          title: 'Luxury Property Specialist',
          bio: 'James brings 8 years of expertise in high-end mountain real estate, with a focus on investment properties and vacation homes. Originally from San Francisco, he understands what discerning buyers from major metros are looking for.',
          photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        },
      },
    },
    include: { agent: true },
  })

  const agent1 = agentUser1.agent!
  const agent2 = agentUser2.agent!

  const listings = [
    {
      agentId: agent1.id,
      streetAddress: '415 E Hyman Ave',
      city: 'Aspen',
      state: 'CO',
      zipCode: '81611',
      county: 'Pitkin',
      latitude: 39.1855,
      longitude: -106.8196,
      neighborhood: 'East Aspen',
      propertyType: PropertyType.SINGLE_FAMILY,
      listPrice: 485000000, // $4,850,000
      bedrooms: 5,
      bathrooms: 4.5,
      squareFeet: 4200,
      lotSizeSqFt: 8500,
      yearBuilt: 2018,
      garageSpaces: 2,
      hasPool: false,
      description: 'Stunning ski-in/ski-out mountain chalet with breathtaking views of Aspen Mountain. This immaculate 5-bedroom residence features vaulted ceilings, a gourmet kitchen with Wolf appliances, radiant floor heating, and a wraparound deck perfect for entertaining. Walking distance to downtown Aspen restaurants and shops.',
      photos: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      ],
      priceEvents: [
        { price: 510000000, event: 'Listed', daysAgo: 120 },
        { price: 495000000, event: 'Price Reduced', daysAgo: 60 },
        { price: 485000000, event: 'Price Reduced', daysAgo: 14 },
      ],
    },
    {
      agentId: agent2.id,
      streetAddress: '789 Mountain Village Blvd',
      city: 'Telluride',
      state: 'CO',
      zipCode: '81435',
      county: 'San Miguel',
      latitude: 37.9375,
      longitude: -107.8123,
      neighborhood: 'Mountain Village',
      propertyType: PropertyType.CONDO,
      listPrice: 189000000, // $1,890,000
      bedrooms: 3,
      bathrooms: 3,
      squareFeet: 1850,
      yearBuilt: 2015,
      garageSpaces: 1,
      hasPool: true,
      description: 'Luxury ski-in/ski-out condo at the base of Telluride Ski Resort. Fully furnished with high-end finishes, this turn-key property includes access to the Mountain Village amenities: pool, hot tub, fitness center, and concierge service. Strong rental history available upon request.',
      photos: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
      ],
      priceEvents: [
        { price: 189000000, event: 'Listed', daysAgo: 30 },
      ],
    },
    {
      agentId: agent1.id,
      streetAddress: '223 S Main St',
      city: 'Breckenridge',
      state: 'CO',
      zipCode: '80424',
      county: 'Summit',
      latitude: 39.4817,
      longitude: -106.0384,
      neighborhood: 'Historic District',
      propertyType: PropertyType.TOWNHOUSE,
      listPrice: 139500000, // $1,395,000
      bedrooms: 4,
      bathrooms: 3.5,
      squareFeet: 2600,
      lotSizeSqFt: 3200,
      yearBuilt: 2020,
      garageSpaces: 2,
      hasPool: false,
      description: 'Newly built townhome in the heart of downtown Breckenridge. Walk to the gondola, world-class restaurants, and shops. This modern mountain property features an open-concept living area, quartz countertops, custom cabinetry, and a private rooftop deck with panoramic ski area views.',
      photos: [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80',
      ],
      priceEvents: [
        { price: 149900000, event: 'Listed', daysAgo: 90 },
        { price: 139500000, event: 'Price Reduced', daysAgo: 21 },
      ],
    },
    {
      agentId: agent2.id,
      streetAddress: '1044 Vail Valley Dr',
      city: 'Vail',
      state: 'CO',
      zipCode: '81657',
      county: 'Eagle',
      latitude: 39.6433,
      longitude: -106.3781,
      neighborhood: 'Vail Village',
      propertyType: PropertyType.SINGLE_FAMILY,
      listPrice: 725000000, // $7,250,000
      bedrooms: 6,
      bathrooms: 6,
      squareFeet: 5800,
      lotSizeSqFt: 12000,
      yearBuilt: 2021,
      garageSpaces: 3,
      hasPool: true,
      description: 'Exceptional Vail Village estate with unobstructed views of the Gore Range. This architect-designed masterpiece features 6 en-suite bedrooms, a chef\'s kitchen, wine cellar, home theater, and heated outdoor pool. The ultimate Colorado mountain retreat, minutes from world-class skiing.',
      photos: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80',
        'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80',
      ],
      priceEvents: [
        { price: 725000000, event: 'Listed', daysAgo: 7 },
      ],
    },
    {
      agentId: agent1.id,
      streetAddress: '88 Elk Run Dr',
      city: 'Steamboat Springs',
      state: 'CO',
      zipCode: '80487',
      county: 'Routt',
      latitude: 40.4850,
      longitude: -106.8317,
      neighborhood: 'Steamboat Base Area',
      propertyType: PropertyType.SINGLE_FAMILY,
      listPrice: 98500000, // $985,000
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1750,
      lotSizeSqFt: 9000,
      yearBuilt: 2005,
      garageSpaces: 2,
      hasPool: false,
      description: 'Charming mountain home near Steamboat Ski Resort. Updated kitchen and bathrooms, hardwood floors throughout, and a large hot tub deck with mountain views. This is an excellent primary residence or vacation rental investment in Colorado\'s "Ski Town USA."',
      photos: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
        'https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?w=1200&q=80',
      ],
      priceEvents: [
        { price: 107500000, event: 'Listed', daysAgo: 180 },
        { price: 102900000, event: 'Price Reduced', daysAgo: 90 },
        { price: 98500000, event: 'Price Reduced', daysAgo: 30 },
      ],
    },
    {
      agentId: agent2.id,
      streetAddress: '560 Winter Park Dr',
      city: 'Winter Park',
      state: 'CO',
      zipCode: '80482',
      county: 'Grand',
      latitude: 39.8867,
      longitude: -105.7631,
      neighborhood: 'Winter Park Resort',
      propertyType: PropertyType.CONDO,
      listPrice: 64900000, // $649,000
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1100,
      yearBuilt: 2012,
      garageSpaces: 1,
      hasPool: true,
      description: 'Slope-side condo steps from the Winter Park chairlift. Updated unit with granite countertops, stainless appliances, and a private balcony with ski trail views. Building amenities include heated pool, hot tubs, fitness room, and ski storage. Excellent short-term rental potential.',
      photos: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
      ],
      priceEvents: [
        { price: 67500000, event: 'Listed', daysAgo: 45 },
        { price: 64900000, event: 'Price Reduced', daysAgo: 10 },
      ],
    },
    {
      agentId: agent1.id,
      streetAddress: '340 Crested Butte Way',
      city: 'Crested Butte',
      state: 'CO',
      zipCode: '81224',
      county: 'Gunnison',
      latitude: 38.8697,
      longitude: -106.9878,
      neighborhood: 'Mt. Crested Butte',
      propertyType: PropertyType.SINGLE_FAMILY,
      listPrice: 159000000, // $1,590,000
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 2400,
      lotSizeSqFt: 6500,
      yearBuilt: 2016,
      garageSpaces: 2,
      hasPool: false,
      description: 'Beautifully crafted mountain home at Mt. Crested Butte with ski-in/ski-out access to the East River lift. Open floor plan, gas fireplace, sauna, and a deck with sweeping views of the Elk Mountains. Crested Butte offers Colorado\'s most authentic mountain town experience.',
      photos: [
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80',
      ],
      priceEvents: [
        { price: 159000000, event: 'Listed', daysAgo: 14 },
      ],
    },
    {
      agentId: agent2.id,
      streetAddress: '77 Snowmass Village Rd',
      city: 'Snowmass Village',
      state: 'CO',
      zipCode: '81615',
      county: 'Pitkin',
      latitude: 39.2092,
      longitude: -106.9403,
      neighborhood: 'Snowmass Base Village',
      propertyType: PropertyType.CONDO,
      listPrice: 229500000, // $2,295,000
      bedrooms: 3,
      bathrooms: 3,
      squareFeet: 2100,
      yearBuilt: 2019,
      garageSpaces: 1,
      hasPool: true,
      description: 'Premier slope-side residence in Snowmass Base Village, Aspen\'s next-door neighbor with 300+ skiable acres. Fully furnished with designer interiors, this three-bedroom ski-in/ski-out condo includes hotel-style concierge, spa, pool, and underground parking. Just 9 miles from downtown Aspen.',
      photos: [
        'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1200&q=80',
        'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80',
      ],
      priceEvents: [
        { price: 245000000, event: 'Listed', daysAgo: 75 },
        { price: 229500000, event: 'Price Reduced', daysAgo: 20 },
      ],
    },
    {
      agentId: agent1.id,
      streetAddress: '1 Copper Mountain Rd',
      city: 'Copper Mountain',
      state: 'CO',
      zipCode: '80443',
      county: 'Summit',
      latitude: 39.5020,
      longitude: -106.1491,
      neighborhood: 'East Village',
      propertyType: PropertyType.TOWNHOUSE,
      listPrice: 87500000, // $875,000
      bedrooms: 3,
      bathrooms: 2.5,
      squareFeet: 1600,
      lotSizeSqFt: 1800,
      yearBuilt: 2010,
      garageSpaces: 1,
      hasPool: false,
      description: 'Ski-in/ski-out townhome in Copper Mountain\'s East Village, the quieter, family-friendly side of the resort. Renovated kitchen, updated baths, gas fireplace, and a mudroom perfect for gear storage. Walk to the Super Bee lift, restaurants, and ice skating. Strong vacation rental income history.',
      photos: [
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80',
      ],
      priceEvents: [
        { price: 92000000, event: 'Listed', daysAgo: 60 },
        { price: 87500000, event: 'Price Reduced', daysAgo: 15 },
      ],
    },
    {
      agentId: agent2.id,
      streetAddress: '455 Mountain Road',
      city: 'Keystone',
      state: 'CO',
      zipCode: '80435',
      county: 'Summit',
      latitude: 39.6078,
      longitude: -105.9694,
      neighborhood: 'River Run Village',
      propertyType: PropertyType.CONDO,
      listPrice: 57900000, // $579,000
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 950,
      yearBuilt: 2008,
      garageSpaces: 1,
      hasPool: true,
      description: 'Slopeside condo in Keystone\'s River Run Village, one of Colorado\'s most family-friendly ski resorts. This well-maintained unit features an updated kitchen, ski locker, and access to River Run\'s amenities including a heated pool and hot tubs. Easy I-70 access — just 75 minutes from Denver.',
      photos: [
        'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
      ],
      priceEvents: [
        { price: 57900000, event: 'Listed', daysAgo: 5 },
      ],
    },
  ]

  for (const listing of listings) {
    const { photos, priceEvents, ...propertyData } = listing

    const property = await prisma.property.create({
      data: {
        ...propertyData,
        photos: {
          create: photos.map((url, i) => ({
            url,
            sortOrder: i,
            isPrimary: i === 0,
          })),
        },
        priceHistory: {
          create: priceEvents.map(({ price, event, daysAgo }) => ({
            price,
            event,
            source: 'Agent',
            date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
          })),
        },
      },
    })
    console.log(`Created: ${property.streetAddress}, ${property.city} — $${(property.listPrice / 100).toLocaleString()}`)
  }

  // Seed neighborhoods
  const neighborhoods = [
    {
      name: 'East Aspen',
      city: 'Aspen',
      description: 'Quiet residential area east of downtown Aspen with easy ski mountain access.',
      medianPrice: 425000000,
      geoJson: {
        type: 'Polygon',
        coordinates: [[
          [-106.8100, 39.1800], [-106.8250, 39.1800],
          [-106.8250, 39.1920], [-106.8100, 39.1920],
          [-106.8100, 39.1800],
        ]],
      },
    },
    {
      name: 'Vail Village',
      city: 'Vail',
      description: 'The heart of Vail — premier ski-in/ski-out properties steps from the gondola.',
      medianPrice: 650000000,
      geoJson: {
        type: 'Polygon',
        coordinates: [[
          [-106.3850, 39.6380], [-106.3700, 39.6380],
          [-106.3700, 39.6480], [-106.3850, 39.6480],
          [-106.3850, 39.6380],
        ]],
      },
    },
    {
      name: 'Mountain Village',
      city: 'Telluride',
      description: 'Telluride\'s gondola-connected resort village with ski-in/ski-out access.',
      medianPrice: 185000000,
      geoJson: {
        type: 'Polygon',
        coordinates: [[
          [-107.8200, 37.9320], [-107.8050, 37.9320],
          [-107.8050, 37.9430], [-107.8200, 37.9430],
          [-107.8200, 37.9320],
        ]],
      },
    },
  ]

  for (const n of neighborhoods) {
    await prisma.neighborhood.upsert({
      where: { name: n.name },
      update: {},
      create: n,
    })
    console.log(`Created neighborhood: ${n.name}`)
  }

  console.log('Seed complete.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
