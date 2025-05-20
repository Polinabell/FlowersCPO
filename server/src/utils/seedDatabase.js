const bcrypt = require('bcryptjs');
const db = require('../models');
const { User, Supplier, Seller, Flower, FlowerSeller, Request } = db;

async function seedDatabase() {
  try {
    console.log('тест данные для бд грузятся');
    
    
    await FlowerSeller.destroy({ where: {} });
    await Request.destroy({ where: {} });
    await Flower.destroy({ where: {} });
    await Seller.destroy({ where: {} });
    await Supplier.destroy({ where: {} });
    await User.destroy({ where: {} });
    
    

    
    const users = await User.bulkCreate([
      {
        name: 'Администратор',
        email: 'admin@example.com',
        password: bcrypt.hashSync('password123', 8),
        role: 'user'
      },
      {
        name: 'Иванов Иван',
        email: 'supplier1@example.com',
        password: bcrypt.hashSync('password123', 8),
        role: 'supplier'
      },
      {
        name: 'Петрова Анна',
        email: 'supplier2@example.com',
        password: bcrypt.hashSync('password123', 8),
        role: 'supplier'
      },
      {
        name: 'Сидоров Алексей',
        email: 'seller1@example.com',
        password: bcrypt.hashSync('password123', 8),
        role: 'seller'
      },
      {
        name: 'Козлова Мария',
        email: 'seller2@example.com',
        password: bcrypt.hashSync('password123', 8),
        role: 'seller'
      },
      {
        name: 'Смирнов Дмитрий',
        email: 'user@example.com',
        password: bcrypt.hashSync('password123', 8),
        role: 'user'
      },
      {
        name: 'Васильев Николай',
        email: 'supplier3@example.com',
        password: bcrypt.hashSync('password123', 8),
        role: 'supplier'
      },
      {
        name: 'Морозова Елена',
        email: 'supplier4@example.com',
        password: bcrypt.hashSync('password123', 8),
        role: 'supplier'
      },
      {
        name: 'Федоров Сергей',
        email: 'supplier5@example.com',
        password: bcrypt.hashSync('password123', 8),
        role: 'supplier'
      },
      {
        name: 'Соколова Ольга',
        email: 'supplier6@example.com',
        password: bcrypt.hashSync('password123', 8),
        role: 'supplier'
      }
    ]);
    
    console.log(`✓ Создано ${users.length} пользователей`);
    
    
    const suppliers = await Supplier.bulkCreate([
      {
        userId: users[1].id,
        companyName: 'Розы России',
        address: 'г. Москва, ул. Цветочная, 1',
        phone: '+7 (999) 123-45-67',
        description: 'Крупнейший поставщик роз в России. Выращиваем и поставляем цветы с 1995 года.',
        fullName: 'Иванов Иван Петрович',
        farmType: 'Тепличное хозяйство'
      },
      {
        userId: users[2].id,
        companyName: 'Лилии и Орхидеи',
        address: 'г. Санкт-Петербург, пр. Ботанический, 123',
        phone: '+7 (999) 765-43-21',
        description: 'Специализируемся на выращивании и поставке экзотических цветов. Наша гордость - редкие сорта орхидей.',
        fullName: 'Петрова Анна Сергеевна',
        farmType: 'Оранжерея'
      },
      {
        userId: users[6].id,
        companyName: 'Альпийские цветы',
        address: 'г. Сочи, ул. Горная, 45',
        phone: '+7 (999) 234-56-78',
        description: 'Выращиваем редкие горные цветы в идеальных климатических условиях предгорий Кавказа.',
        fullName: 'Васильев Николай Иванович',
        farmType: 'Открытый грунт'
      },
      {
        userId: users[7].id,
        companyName: 'Сакура',
        address: 'г. Владивосток, ул. Восточная, 78',
        phone: '+7 (999) 876-54-32',
        description: 'Специализируемся на японских и дальневосточных видах цветов и растений.',
        fullName: 'Морозова Елена Викторовна',
        farmType: 'Ботанический сад'
      },
      {
        userId: users[8].id,
        companyName: 'Сибирский цветок',
        address: 'г. Новосибирск, ул. Таежная, 12',
        phone: '+7 (999) 345-67-89',
        description: 'Выращиваем уникальные сибирские цветы, адаптированные к суровому климату.',
        fullName: 'Федоров Сергей Александрович',
        farmType: 'Экоферма'
      },
      {
        userId: users[9].id,
        companyName: 'Южные тюльпаны',
        address: 'г. Краснодар, ул. Степная, 56',
        phone: '+7 (999) 987-65-43',
        description: 'Крупнейший производитель тюльпанов и других луковичных на юге России.',
        fullName: 'Соколова Ольга Дмитриевна',
        farmType: 'Плантация'
      }
    ]);
    
    console.log(`✓ Создано ${suppliers.length} поставщиков`);
    
    
    const sellers = await Seller.bulkCreate([
      {
        userId: users[3].id,
        fullName: 'Сидоров Алексей Владимирович',
        shopName: 'Цветочный рай',
        address: 'г. Москва, ул. Тверская, 10',
        phone: '+7 (999) 111-22-33',
        rating: 4.7,
        description: 'Магазин премиум-класса в центре Москвы. Доставка 24/7.',
        specialization: 'Свадебные букеты, Подарочные композиции, VIP-оформление'
      },
      {
        userId: users[4].id,
        fullName: 'Козлова Мария Андреевна',
        shopName: 'Букет за час',
        address: 'г. Москва, ул. Ленина, 15',
        phone: '+7 (999) 444-55-66',
        rating: 4.2,
        description: 'Быстрая доставка букетов по всей Москве. Гарантия свежести цветов.',
        specialization: 'Экспресс-доставка, Бюджетные букеты, Корпоративные заказы'
      },
      {
        userId: users[5].id,
        fullName: 'Смирнов Дмитрий Сергеевич',
        shopName: 'Экзотика',
        address: 'г. Москва, Цветной бульвар, 22',
        phone: '+7 (999) 777-88-99',
        rating: 4.8,
        description: 'Специализируемся на редких и экзотических цветах со всего мира.',
        specialization: 'Экзотические цветы, Тропические растения, Редкие сорта'
      },
      {
        userId: users[0].id,
        fullName: 'Администратор Системы',
        shopName: 'Флора Центр',
        address: 'г. Москва, Кутузовский проспект, 30',
        phone: '+7 (999) 222-33-44',
        rating: 4.5,
        description: 'Крупный оптово-розничный центр цветов с самым широким ассортиментом.',
        specialization: 'Оптовые заказы, Розничная продажа, Комнатные растения, Срезанные цветы'
      },
      {
        userId: users[6].id,
        fullName: 'Васильев Николай Иванович',
        shopName: 'Горная Флора',
        address: 'г. Сочи, ул. Приморская, 55',
        phone: '+7 (999) 333-44-55',
        rating: 4.3,
        description: 'Специализируемся на горных и альпийских цветах, выращенных в экологически чистых районах.',
        specialization: 'Горные растения, Альпийские цветы, Экологические букеты'
      }
    ]);
    
    console.log(`✓ Создано ${sellers.length} продавцов`);
    
    
    const flowers = await Flower.bulkCreate([
      {
        name: 'Красные розы',
        type: 'Розы',
        season: 'Круглый год',
        country: 'Россия',
        variety: 'Red Naomi',
        price: 250.00,
        supplierId: suppliers[0].id,
        imageUrl: 'https://avatars.mds.yandex.net/i?id=5048cd65c1f45640496dc960fb1fdecd26ee2226-10930201-images-thumbs&n=13',
        description: 'Элегантные красные розы с насыщенным цветом и сильным ароматом. Идеально подходят для романтических букетов.'
      },
      {
        name: 'Белые лилии',
        type: 'Лилии',
        season: 'Лето',
        country: 'Голландия',
        variety: 'Касабланка',
        price: 350.00,
        supplierId: suppliers[1].id,
        imageUrl: 'https://avatars.mds.yandex.net/i?id=49a487ddfdc90595f4717c93742319dc5a700402-4268363-images-thumbs&n=13',
        description: 'Изысканные белые лилии с тонким ароматом. Символизируют чистоту и невинность.'
      },
      {
        name: 'Желтые тюльпаны',
        type: 'Тюльпаны',
        season: 'Весна',
        country: 'Голландия',
        variety: 'Strong Gold',
        price: 180.00,
        supplierId: suppliers[0].id,
        imageUrl: 'https://avatars.mds.yandex.net/i?id=0659490734500b47cb6610e726badca73aa62969-4988309-images-thumbs&n=13',
        description: 'Яркие желтые тюльпаны символизируют солнечный свет и радость. Отлично подходят для весенних букетов.'
      },
      {
        name: 'Розовые орхидеи',
        type: 'Орхидеи',
        season: 'Круглый год',
        country: 'Таиланд',
        variety: 'Phalaenopsis',
        price: 450.00,
        supplierId: suppliers[1].id,
        imageUrl: 'https://avatars.mds.yandex.net/i?id=59f30ce2d79c2bf93224e56ae8446b92e02cc7a3-2988630-images-thumbs&n=13',
        description: 'Экзотические орхидеи с нежно-розовыми цветами. Символ утонченности и изысканности.'
      },
      {
        name: 'Ромашки',
        type: 'Полевые',
        season: 'Лето',
        country: 'Россия',
        variety: 'Обыкновенная',
        price: 150.00,
        supplierId: suppliers[0].id,
        imageUrl: 'https://avatars.mds.yandex.net/i?id=98f71b1f0f920fc48bb9bab83f65d7a7cb45d63c-5221061-images-thumbs&n=13',
        description: 'Простые и милые ромашки символизируют искренность и чистоту чувств.'
      },
      {
        name: 'Синие гиацинты',
        type: 'Гиацинты',
        season: 'Весна',
        country: 'Голландия',
        variety: 'Blue Jacket',
        price: 220.00,
        supplierId: suppliers[1].id,
        imageUrl: 'https://avatars.mds.yandex.net/i?id=2c26395eb5ce171d14867381263a30a4d1aaacbe-10813564-images-thumbs&n=13',
        description: 'Ароматные гиацинты синего цвета. Приносят в дом весеннее настроение.'
      },
      
      {
        name: 'Эдельвейс',
        type: 'Горные',
        season: 'Лето',
        country: 'Россия',
        variety: 'Альпийский',
        price: 500.00,
        supplierId: suppliers[2].id,
        imageUrl: 'https://avatars.mds.yandex.net/i?id=84c53ee671f36023fec49e753844c69ffc2c343b-4355070-images-thumbs&n=13',
        description: 'Редкий горный цветок, символ верности и отваги. Выращен в экологически чистых условиях.'
      },
      {
        name: 'Горная лаванда',
        type: 'Лаванда',
        season: 'Лето',
        country: 'Россия',
        variety: 'Кавказская',
        price: 280.00,
        supplierId: suppliers[2].id,
        imageUrl: 'https://avatars.mds.yandex.net/i?id=0885e7ecb7638cf2b5f76c95b327fede-5665918-images-thumbs&n=13',
        description: 'Ароматная лаванда с горных склонов Кавказа. Обладает более насыщенным запахом, чем обычная.'
      },
      {
        name: 'Горечавка',
        type: 'Горные',
        season: 'Весна',
        country: 'Россия',
        variety: 'Acaulis',
        price: 320.00,
        supplierId: suppliers[2].id,
        imageUrl: 'https://avatars.mds.yandex.net/i?id=2ee550db6bbcb55c2e110d3de381b1ee8619fd48-12325594-images-thumbs&n=13',
        description: 'Яркие синие цветы, растущие высоко в горах. Символизируют красоту нетронутой природы.'
      },
      
      {
        name: 'Японская сакура',
        type: 'Цветущие деревья',
        season: 'Весна',
        country: 'Япония',
        variety: 'Somei Yoshino',
        price: 600.00,
        supplierId: suppliers[3].id,
        imageUrl: 'https://avatars.mds.yandex.net/i?id=2f9a115fb40d028c4b1c7f5fbb1d6a19826c27b6-9222386-images-thumbs&n=13',
        description: 'Нежные розовые цветы вишни из Японии. Символ быстротечности жизни и красоты.'
      },
      {
        name: 'Японский ирис',
        type: 'Ирисы',
        season: 'Лето',
        country: 'Япония',
        variety: 'Ensata',
        price: 380.00,
        supplierId: suppliers[3].id,
        imageUrl: 'https://avatars.mds.yandex.net/i?id=259a2c0e3d8be972294e5c0b785963f2efdcfab3-10360812-images-thumbs&n=13',
        description: 'Изысканные японские ирисы с уникальным рисунком лепестков. Традиционный символ Японии.'
      },
      {
        name: 'Камелия',
        type: 'Камелии',
        season: 'Зима',
        country: 'Япония',
        variety: 'Japonica',
        price: 420.00,
        supplierId: suppliers[3].id,
        imageUrl: 'https://avatars.mds.yandex.net/i?id=202834d3da4dc73540d5ed7c728253adda6cf3de-4426074-images-thumbs&n=13',
        description: 'Зимнецветущие камелии из Японии. Символизируют совершенство и долголетие.'
      },
      
      {
        name: 'Сибирский ирис',
        type: 'Ирисы',
        season: 'Весна',
        country: 'Россия',
        variety: 'Sibirica',
        price: 240.00,
        supplierId: suppliers[4].id,
        imageUrl: 'https://avatars.mds.yandex.net/i?id=f79e1b1edaee3624a16dbb25a6789bd7c065964c-9158689-images-thumbs&n=13',
        description: 'Морозостойкие ирисы из Сибири. Отличаются особой выносливостью и яркостью цвета.'
      },
      {
        name: 'Купальница сибирская',
        type: 'Луговые',
        season: 'Лето',
        country: 'Россия',
        variety: 'Trollius asiaticus',
        price: 210.00,
        supplierId: suppliers[4].id,
        imageUrl: 'https://avatars.mds.yandex.net/i?id=1478c8f6f7073c5016bbd96fe2182d0b0b2a73f7-5247794-images-thumbs&n=13',
        description: 'Яркие оранжевые цветы, растущие на сибирских лугах. Символ сибирского лета.'
      },
      {
        name: 'Пион сибирский',
        type: 'Пионы',
        season: 'Лето',
        country: 'Россия',
        variety: 'Albiflora',
        price: 350.00,
        supplierId: suppliers[4].id,
        imageUrl: 'https://avatars.mds.yandex.net/i?id=db2c804fe89992f4a554635bf4fbedbb-5233506-images-thumbs&n=13',
        description: 'Морозостойкие пионы, выведенные в Сибири. Отличаются особой пышностью цветения даже в суровых условиях.'
      },
      
      {
        name: 'Красные тюльпаны',
        type: 'Тюльпаны',
        season: 'Весна',
        country: 'Россия',
        variety: 'Red Emperor',
        price: 190.00,
        supplierId: suppliers[5].id,
        imageUrl: 'https://avatars.mds.yandex.net/i?id=d51fa1153ee86cbd112bd2a8ea71b1f13b488915-6073906-images-thumbs&n=13',
        description: 'Яркие красные тюльпаны с крупными бутонами. Выращены в солнечном Краснодарском крае.'
      },
      {
        name: 'Лилии южные',
        type: 'Лилии',
        season: 'Лето',
        country: 'Россия',
        variety: 'Южная красавица',
        price: 320.00,
        supplierId: suppliers[5].id,
        imageUrl: 'https://avatars.mds.yandex.net/i?id=9190004543f4c9d83a2adf06619ee486-5232617-images-thumbs&n=13',
        description: 'Теплолюбивые лилии из южных регионов России. Отличаются крупными яркими цветами.'
      },
      {
        name: 'Нарциссы ранние',
        type: 'Нарциссы',
        season: 'Весна',
        country: 'Россия',
        variety: 'Талия',
        price: 170.00,
        supplierId: suppliers[5].id,
        imageUrl: 'https://avatars.mds.yandex.net/i?id=d2241c08c8eebb9edb52a1cf3568e9dd8d8ce418-13066638-images-thumbs&n=13',
        description: 'Ранние нарциссы, выращенные в теплом климате юга России. Расцветают раньше других сортов.'
      }
    ]);
    
    console.log(`Создано ${flowers.length} видов цветов`);
    
    
    const flowerSellers = await FlowerSeller.bulkCreate([
      {
        flowerId: flowers[0].id,
        sellerId: sellers[0].id,
        quantity: 100,
        price: 300.00
      },
      {
        flowerId: flowers[0].id,
        sellerId: sellers[1].id,
        quantity: 50,
        price: 290.00
      },
      {
        flowerId: flowers[1].id,
        sellerId: sellers[0].id,
        quantity: 30,
        price: 400.00
      },
      {
        flowerId: flowers[2].id,
        sellerId: sellers[1].id,
        quantity: 80,
        price: 200.00
      },
      {
        flowerId: flowers[3].id,
        sellerId: sellers[0].id,
        quantity: 20,
        price: 500.00
      },
      {
        flowerId: flowers[4].id,
        sellerId: sellers[1].id,
        quantity: 60,
        price: 180.00
      },
      {
        flowerId: flowers[5].id,
        sellerId: sellers[0].id,
        quantity: 40,
        price: 250.00
      },
      
      {
        flowerId: flowers[6].id,
        sellerId: sellers[0].id,
        quantity: 15,
        price: 550.00
      },
      {
        flowerId: flowers[6].id,
        sellerId: sellers[1].id,
        quantity: 10,
        price: 580.00
      },
      {
        flowerId: flowers[7].id,
        sellerId: sellers[0].id,
        quantity: 40,
        price: 320.00
      },
      {
        flowerId: flowers[8].id,
        sellerId: sellers[1].id,
        quantity: 25,
        price: 350.00
      },
      {
        flowerId: flowers[9].id,
        sellerId: sellers[0].id,
        quantity: 5,
        price: 650.00
      },
      {
        flowerId: flowers[10].id,
        sellerId: sellers[1].id,
        quantity: 30,
        price: 400.00
      },
      {
        flowerId: flowers[11].id,
        sellerId: sellers[0].id,
        quantity: 15,
        price: 450.00
      },
      {
        flowerId: flowers[12].id,
        sellerId: sellers[1].id,
        quantity: 20,
        price: 280.00
      },
      {
        flowerId: flowers[13].id,
        sellerId: sellers[0].id,
        quantity: 35,
        price: 260.00
      },
      {
        flowerId: flowers[14].id,
        sellerId: sellers[1].id,
        quantity: 45,
        price: 220.00
      },
      {
        flowerId: flowers[15].id,
        sellerId: sellers[0].id,
        quantity: 50,
        price: 380.00
      },
      {
        flowerId: flowers[16].id,
        sellerId: sellers[1].id,
        quantity: 40,
        price: 200.00
      },
      {
        flowerId: flowers[17].id,
        sellerId: sellers[0].id,
        quantity: 60,
        price: 350.00
      }
    ]);
    
    console.log(`Создано ${flowerSellers.length} связей между цветами и продавцами`);
    
    
    const requests = await Request.bulkCreate([
      {
        title: "Розы красные на свадьбу",
        description: "Нужны красные розы для свадебной церемонии 15 июня",
        status: "new",
        userId: users[5].id,
        flowerType: "Розы",
        quantity: 50,
        deadline: new Date("2023-06-15"),
        contactPhone: "+7 (999) 123-45-67",
        contactEmail: "user@example.com"
      },
      {
        title: "Тюльпаны для офиса",
        description: "Требуются свежие тюльпаны разных цветов для украшения офиса на корпоративное мероприятие",
        status: "processing",
        userId: users[5].id,
        flowerType: "Тюльпаны",
        quantity: 100,
        deadline: new Date("2023-05-25"),
        contactPhone: "+7 (999) 123-45-67",
        contactEmail: "user@example.com"
      },
      {
        title: "Орхидеи для ресторана",
        description: "Нужны белые орхидеи для оформления столов в ресторане",
        status: "completed",
        userId: users[3].id,
        flowerType: "Орхидеи",
        quantity: 30,
        deadline: new Date("2023-05-10"),
        contactPhone: "+7 (999) 111-22-33",
        contactEmail: "seller1@example.com"
      }
    ]);
    
    console.log(`Создано ${requests.length} запросов на цветы`);
    
    console.log('База данных успешно заполнена тестовыми данными!');
    return { success: true };
    
  } catch (error) {
    console.error(' Ошибка при заполнении бдшки чет:', error);
    return { success: false, error };
  }
}


if (require.main === module) {
  seedDatabase()
    .then(result => {
      if (result.success) {
        console.log('все ок');
      } else {
        console.error('все не ок эх');
      }
      process.exit();
    });
}

module.exports = seedDatabase; 