insert into public.businesses (
  name, slug, description, category, market, street, city, state, phone, whatsapp,
  latitude, longitude, status, verified, cover_image_url
) values
  (
    'Balogun Fabrics Hub',
    'balogun-fabrics-hub',
    'Verified fabric vendor with ankara, lace, aso oke, and ready-to-wear material selections.',
    'Fashion and textiles',
    'Balogun Market',
    'Lagos Island',
    'Lagos',
    'Lagos',
    '+2348012345678',
    '+2348012345678',
    6.4550,
    3.3841,
    'approved',
    true,
    null
  ),
  (
    'Computer Village Mobile Deals',
    'computer-village-mobile-deals',
    'Phone, laptop, accessories, repairs, and verified device swaps inside Ikeja Computer Village.',
    'Electronics',
    'Computer Village',
    'Otigba Street',
    'Ikeja',
    'Lagos',
    '+2348022223344',
    '+2348022223344',
    6.5962,
    3.3405,
    'approved',
    true,
    null
  ),
  (
    'Ariaria Leather Works',
    'ariaria-leather-works',
    'Locally made leather sandals, school shoes, belts, and corporate footwear from Aba.',
    'Footwear',
    'Ariaria International Market',
    'Faulks Road',
    'Aba',
    'Abia',
    '+2348034567890',
    '+2348034567890',
    5.1131,
    7.3667,
    'approved',
    true,
    null
  ),
  (
    'Wuse Home Essentials',
    'wuse-home-essentials',
    'Kitchenware, bedding, decor, small appliances, and bulk home supply options.',
    'Home goods',
    'Wuse Market',
    'Zone 5',
    'Abuja',
    'FCT',
    '+2348056677889',
    '+2348056677889',
    9.0765,
    7.4730,
    'approved',
    false,
    null
  );

insert into public.products (
  business_id, name, description, category, price, currency, stock_status, image_url
)
select id, 'Premium Ankara Bundle', 'Six yards of quality ankara fabric with bold color retention.', 'Fabric', 18500, 'NGN', 'in_stock', null
from public.businesses where slug = 'balogun-fabrics-hub';

insert into public.products (
  business_id, name, description, category, price, currency, stock_status, image_url
)
select id, 'French Lace Set', 'Occasion-ready lace set for aso ebi and ceremonial wear.', 'Fabric', 48000, 'NGN', 'low_stock', null
from public.businesses where slug = 'balogun-fabrics-hub';

insert into public.products (
  business_id, name, description, category, price, currency, stock_status, image_url
)
select id, 'UK Used iPhone 13', 'Clean unit with battery health above 85 percent and warranty check.', 'Phones', 445000, 'NGN', 'in_stock', null
from public.businesses where slug = 'computer-village-mobile-deals';

insert into public.products (
  business_id, name, description, category, price, currency, stock_status, image_url
)
select id, '65W USB-C Charger', 'Fast charger compatible with most USB-C laptops and phones.', 'Accessories', 18500, 'NGN', 'in_stock', null
from public.businesses where slug = 'computer-village-mobile-deals';

insert into public.products (
  business_id, name, description, category, price, currency, stock_status, image_url
)
select id, 'Handmade Corporate Loafers', 'Aba-made leather loafers available in black and brown.', 'Shoes', 32000, 'NGN', 'in_stock', null
from public.businesses where slug = 'ariaria-leather-works';

insert into public.products (
  business_id, name, description, category, price, currency, stock_status, image_url
)
select id, 'Non-stick Cookware Set', 'Five-piece cookware set with heat-resistant handles.', 'Kitchen', 39000, 'NGN', 'in_stock', null
from public.businesses where slug = 'wuse-home-essentials';
