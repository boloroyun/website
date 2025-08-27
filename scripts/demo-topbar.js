// Demo script to show how TopBar data should be structured
// This is for reference only - use your admin panel to add actual data

const demoTopBars = [
  {
    title: '🎉 Black Friday Sale - Up to 70% OFF! Limited Time Only',
    link: '/sale',
    textColor: '#FFFFFF',
    backgroundColor: '#000000',
    button: {
      text: 'Shop Now',
      link: '/sale',
      textColor: '#000000',
      backgroundColor: '#FFD700',
    },
  },
  {
    title: '✨ Free Shipping on Orders Over $100',
    link: '/shipping-info',
    textColor: '#000000',
    backgroundColor: '#E8F5E8',
    button: {
      text: 'Learn More',
      link: '/shipping-info',
      textColor: '#FFFFFF',
      backgroundColor: '#28A745',
    },
  },
  {
    title: '📞 Need Help? Call us at 1-800-EXAMPLE',
    link: '/contact',
    textColor: '#FFFFFF',
    backgroundColor: '#007BFF',
    // No button for this one
  },
];

console.log('Demo TopBar data structure:');
console.log(JSON.stringify(demoTopBars, null, 2));

/* 
To add these to your database, use your admin panel or Prisma Studio:

await prisma.topBar.createMany({
  data: demoTopBars
});
*/
