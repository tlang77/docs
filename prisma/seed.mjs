// Plain ESM — no TypeScript, no tsx. Node 22 runs this natively.
import { createRequire } from 'module'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const { PrismaClient } = await import('../src/generated/prisma/index.js')

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
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
          bio: 'Sarah has 12 years of experience specializing in luxury mountain properties across Aspen, Telluride, and Breckenridge.',
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
          bio: 'James brings 8 years of expertise in high-end mountain real estate, with a focus on investment properties and vacation homes.',
          photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        },
      },
    },
    include: { agent: true },
  })

  const agent1 = agentUser1.agent
  const agent2 = agentUser2.agent

  const listings = [
    {
      agentId: agent1.id,
      streetAddress: '415 E Hyman Ave',
      city: 'Aspen', state: 'CO', zipCode: '81611', county: 'Pitkin',
      latitude: 39.1855, longitude: -106.8196, neighborhood: 'East Aspen',
      propertyType: 'SINGLE_FAMILY', listPrice: 485000000,
      bedrooms: 5, bathrooms: 4.5, squareFeet: 4200, lotSizeSqFt: 8500,
      yearBuilt: 2018, garageSpaces: 2, hasPool: false,
      description: 'Stunning ski-in/ski-out mountain chalet with breathtaking views of Aspen Mountain. 5 bedrooms, vaulted ceilings, gourmet kitchen, radiant floor heating, wraparound deck.',
      photos: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
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
      city: 'Telluride', state: 'CO', zipCode: '81435', county: 'San Miguel',
      latitude: 37.9375, longitude: -107.8123, neighborhood: 'Mountain Village',
      propertyType: 'CONDO', listPrice: 189000000,
      bedrooms: 3, bathrooms: 3, squareFeet: 1850,
      yearBuilt: 2015, garageSpaces: 1, hasPool: true,
      description: 'Luxury ski-in/ski-out condo at the base of Telluride Ski Resort. Fully furnished, turn-key. Pool, hot tub, fitness center, concierge.',
      photos: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
      ],
      priceEvents: [
        { price: 189000000, event: 'Listed', daysAgo: 30 },
      ],
    },
    {
      agentId: agent1.id,
      streetAddress: '223 S Main St',
      city: 'Breckenridge', state: 'CO', zipCode: '80424', county: 'Summit',
      latitude: 39.4817, longitude: -106.0384, neighborhood: 'Historic District',
      propertyType: 'TOWNHOUSE', listPrice: 139500000,
      bedrooms: 4, bathrooms: 3.5, squareFeet: 2600, lotSizeSqFt: 3200,
      yearBuilt: 2020, garageSpaces: 2, hasPool: false,
      description: 'Newly built townhome in the heart of downtown Breckenridge. Walk to the gondola. Modern mountain finishes, rooftop deck with panoramic ski views.',
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
      city: 'Vail', state: 'CO', zipCode: '81657', county: 'Eagle',
      latitude: 39.6433, longitude: -106.3781, neighborhood: 'Vail Village',
      propertyType: 'SINGLE_FAMILY', listPrice: 725000000,
      bedrooms: 6, bathrooms: 6, squareFeet: 5800, lotSizeSqFt: 12000,
      yearBuilt: 2021, garageSpaces: 3, hasPool: true,
      description: 'Exceptional Vail Village estate. Architect-designed, 6 en-suite bedrooms, chef\'s kitchen, wine cellar, home theater, heated outdoor pool.',
      photos: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80',
      ],
      priceEvents: [
        { price: 725000000, event: 'Listed', daysAgo: 7 },
      ],
    },
    {
      agentId: agent1.id,
      streetAddress: '88 Elk Run Dr',
      city: 'Steamboat Springs', state: 'CO', zipCode: '80487', county: 'Routt',
      latitude: 40.4850, longitude: -106.8317, neighborhood: 'Steamboat Base Area',
      propertyType: 'SINGLE_FAMILY', listPrice: 98500000,
      bedrooms: 3, bathrooms: 2, squareFeet: 1750, lotSizeSqFt: 9000,
      yearBuilt: 2005, garageSpaces: 2, hasPool: false,
      description: 'Charming mountain home near Steamboat Ski Resort. Updated kitchen and baths, hardwood floors, hot tub deck with mountain views.',
      photos: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
      ],
      priceEvents: [
        { price: 107500000, event: 'Listed', daysAgo: 180 },
        { price: 98500000, event: 'Price Reduced', daysAgo: 30 },
      ],
    },
    {
      agentId: agent2.id,
      streetAddress: '560 Winter Park Dr',
      city: 'Winter Park', state: 'CO', zipCode: '80482', county: 'Grand',
      latitude: 39.8867, longitude: -105.7631, neighborhood: 'Winter Park Resort',
      propertyType: 'CONDO', listPrice: 64900000,
      bedrooms: 2, bathrooms: 2, squareFeet: 1100,
      yearBuilt: 2012, garageSpaces: 1, hasPool: true,
      description: 'Slope-side condo steps from the Winter Park chairlift. Granite countertops, private balcony with ski trail views. Heated pool, hot tubs, ski storage.',
      photos: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
      ],
      priceEvents: [
        { price: 67500000, event: 'Listed', daysAgo: 45 },
        { price: 64900000, event: 'Price Reduced', daysAgo: 10 },
      ],
    },
    {
      agentId: agent1.id,
      streetAddress: '340 Crested Butte Way',
      city: 'Crested Butte', state: 'CO', zipCode: '81224', county: 'Gunnison',
      latitude: 38.8697, longitude: -106.9878, neighborhood: 'Mt. Crested Butte',
      propertyType: 'SINGLE_FAMILY', listPrice: 159000000,
      bedrooms: 4, bathrooms: 3, squareFeet: 2400, lotSizeSqFt: 6500,
      yearBuilt: 2016, garageSpaces: 2, hasPool: false,
      description: 'Mountain home at Mt. Crested Butte with ski-in/ski-out access. Gas fireplace, sauna, deck with Elk Mountain views.',
      photos: [
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80',
      ],
      priceEvents: [
        { price: 159000000, event: 'Listed', daysAgo: 14 },
      ],
    },
    {
      agentId: agent2.id,
      streetAddress: '77 Snowmass Village Rd',
      city: 'Snowmass Village', state: 'CO', zipCode: '81615', county: 'Pitkin',
      latitude: 39.2092, longitude: -106.9403, neighborhood: 'Snowmass Base Village',
      propertyType: 'CONDO', listPrice: 229500000,
      bedrooms: 3, bathrooms: 3, squareFeet: 2100,
      yearBuilt: 2019, garageSpaces: 1, hasPool: true,
      description: 'Premier slope-side residence in Snowmass Base Village. Designer interiors, ski-in/ski-out, concierge, spa, pool. 9 miles from downtown Aspen.',
      photos: [
        'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1200&q=80',
      ],
      priceEvents: [
        { price: 245000000, event: 'Listed', daysAgo: 75 },
        { price: 229500000, event: 'Price Reduced', daysAgo: 20 },
      ],
    },
    {
      agentId: agent1.id,
      streetAddress: '1 Copper Mountain Rd',
      city: 'Copper Mountain', state: 'CO', zipCode: '80443', county: 'Summit',
      latitude: 39.5020, longitude: -106.1491, neighborhood: 'East Village',
      propertyType: 'TOWNHOUSE', listPrice: 87500000,
      bedrooms: 3, bathrooms: 2.5, squareFeet: 1600, lotSizeSqFt: 1800,
      yearBuilt: 2010, garageSpaces: 1, hasPool: false,
      description: 'Ski-in/ski-out townhome in Copper Mountain\'s East Village. Renovated kitchen, gas fireplace, mudroom. Walk to Super Bee lift.',
      photos: [
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
      city: 'Keystone', state: 'CO', zipCode: '80435', county: 'Summit',
      latitude: 39.6078, longitude: -105.9694, neighborhood: 'River Run Village',
      propertyType: 'CONDO', listPrice: 57900000,
      bedrooms: 2, bathrooms: 2, squareFeet: 950,
      yearBuilt: 2008, garageSpaces: 1, hasPool: true,
      description: 'Slopeside condo in Keystone\'s River Run Village. Updated kitchen, ski locker, heated pool. 75 minutes from Denver.',
      photos: [
        'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&q=80',
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
          create: photos.map((url, i) => ({ url, sortOrder: i, isPrimary: i === 0 })),
        },
        priceHistory: {
          create: priceEvents.map(({ price, event, daysAgo }) => ({
            price, event, source: 'Agent',
            date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
          })),
        },
      },
    })
    console.log(`Created: ${property.streetAddress}, ${property.city}`)
  }

  await prisma.neighborhood.upsert({ where: { name: 'East Aspen' }, update: {}, create: { name: 'East Aspen', city: 'Aspen', medianPrice: 425000000, geoJson: { type: 'Polygon', coordinates: [[[-106.81, 39.18], [-106.825, 39.18], [-106.825, 39.192], [-106.81, 39.192], [-106.81, 39.18]]] } } })
  await prisma.neighborhood.upsert({ where: { name: 'Vail Village' }, update: {}, create: { name: 'Vail Village', city: 'Vail', medianPrice: 650000000, geoJson: { type: 'Polygon', coordinates: [[[-106.385, 39.638], [-106.37, 39.638], [-106.37, 39.648], [-106.385, 39.648], [-106.385, 39.638]]] } } })
  await prisma.neighborhood.upsert({ where: { name: 'Mountain Village' }, update: {}, create: { name: 'Mountain Village', city: 'Telluride', medianPrice: 185000000, geoJson: { type: 'Polygon', coordinates: [[[-107.82, 37.932], [-107.805, 37.932], [-107.805, 37.943], [-107.82, 37.943], [-107.82, 37.932]]] } } })

  console.log('Seed complete.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
