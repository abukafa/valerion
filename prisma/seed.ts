import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create Dummy Seller
  const seller = await prisma.user.upsert({
    where: { email: 'seller@valerion.com' },
    update: {},
    create: {
      email: 'seller@valerion.com',
      name: 'Raja Akun',
      role: 'USER',
      reputation: 150,
      isVerified: true
    },
  })

  console.log(`Created dummy seller with id: ${seller.id}`)

  // Create Dummy Buyer
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@valerion.com' },
    update: {},
    create: {
      email: 'buyer@valerion.com',
      name: 'Pro Player',
      role: 'USER'
    },
  })
  console.log(`Created dummy buyer with id: ${buyer.id}`)

  // Dummy Listings Data
  const listingsData = [
    { code: "Code-2562", originalPrice: 580000, discountPrice: 380000, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80" },
    { code: "Code-2573", originalPrice: 550000, discountPrice: 350000, image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&q=80" },
    { code: "Code-2580", originalPrice: 750000, discountPrice: 450000, image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=500&q=80" },
    { code: "Code-2591", originalPrice: 420000, discountPrice: 290000, image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=500&q=80" },
    { code: "Code-2350", originalPrice: 437000, discountPrice: 350000, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80" },
    { code: "Code-2510", originalPrice: 2062000, discountPrice: 1650000, image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&q=80" },
    { code: "Code-2516", originalPrice: 2401000, discountPrice: 1985000, image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=500&q=80" },
    { code: "Code-2142", originalPrice: 1200000, discountPrice: 900000, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80" },
  ]

  // Clear existing listings to avoid duplicates on multiple seed runs
  await prisma.listing.deleteMany()

  for (const item of listingsData) {
    const listing = await prisma.listing.create({
      data: {
        title: `Akun MLBB - ${item.code}`,
        description: `Akun super langka dengan banyak skin legend dan recall tas tas. Keterangan lengkap hubungi admin. Harga promo dari Rp ${item.originalPrice} menjadi Rp ${item.discountPrice}!`,
        price: item.discountPrice,
        gameName: 'Mobile Legends',
        images: JSON.stringify([item.image, item.image]), // Mocking 2 images as JSON string
        isPremium: Math.random() > 0.5,
        sellerId: seller.id
      }
    })
    console.log(`Created listing: ${listing.title}`)
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
