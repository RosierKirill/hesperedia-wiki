import { v2 as cloudinary } from 'cloudinary'

// 1. Inline configuration
cloudinary.config({
  cloud_name: 'dgf8dymxy',
  api_key: '778595786953147',
  api_secret: 'YSq7Fkj6TMVS-55dMIGH8NMwK4g',
})

async function main() {
  // 2. Upload a sample image from Cloudinary demo CDN
  console.log('Uploading image...')
  const uploadResult = await cloudinary.uploader.upload(
    'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    { public_id: 'hesperedia_test_sample' }
  )
  console.log('\nUpload successful!')
  console.log('  Secure URL :', uploadResult.secure_url)
  console.log('  Public ID  :', uploadResult.public_id)

  // 3. Image metadata
  console.log('\nImage details:')
  console.log('  Width  :', uploadResult.width, 'px')
  console.log('  Height :', uploadResult.height, 'px')
  console.log('  Format :', uploadResult.format)
  console.log('  Size   :', uploadResult.bytes, 'bytes')

  // 4. Transformed URL
  // fetch_format: 'auto' -> Cloudinary picks the best format (webp, avif, etc.)
  // quality: 'auto'      -> Cloudinary adjusts quality to minimize file size
  const transformedUrl = cloudinary.url(uploadResult.public_id, {
    transformation: [{ fetch_format: 'auto', quality: 'auto' }],
    secure: true,
  })

  console.log('\nDone! Click link below to see optimized version of the image.')
  console.log('Check the size and the format.')
  console.log('\nTransformed URL:', transformedUrl)
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
