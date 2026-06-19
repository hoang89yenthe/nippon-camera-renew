import React, { useState, useEffect, useMemo, useRef } from 'react';

// ════════════════════════════════════════════════════
// CONSTANTS & MOCK DATABASE
// ════════════════════════════════════════════════════

const LOCATIONS = [
  '193 Giảng Võ',
  '193 NBK',
  '74 Bà Triệu',
  '42 Huỳnh Thúc Kháng'
];

const STAFFS = [
  'Lê Hồng Quân',
  'Nguyễn Việt Thịnh',
  'Trần Văn Nam',
  'Đỗ Minh Trí'
];

const BRAND_SLOGANS = {
  'FUJI': 'Fuji là nhất, Fuji là chất',
  'CANON': 'Canon - Bản sắc chân thực',
  'SONY': 'Sony - Đỉnh cao công nghệ',
  'DJI': 'DJI - Bay cao sáng tạo',
  'NIKON': 'Nikon - Chất lượng vững bền',
  'RICOH': 'Ricoh - Đậm chất đường phố',
  'SIGMA': 'Sigma - Sắc nét vượt trội',
  'TAMRON': 'Tamron - Đồng hành muôn nơi',
  'VILTROX': 'Viltrox - Giá trị đột phá',
  'LEICA': 'Leica - Đẳng cấp nghệ thuật',
  'HASSELBLAD': 'Hasselblad - Trung thực tuyệt đối',
  'PHỤ KIỆN': 'Phụ kiện máy ảnh chất lượng'
};

// FIX #2: Magic strings → named constants
const PRODUCT_STATUS = {
  IN_STOCK: 'con-hang',
  DEPOSITED: 'da-coc',
  SOLD: 'da-ban',
};

const LOG_TYPE = {
  IMPORT: 'nhap',
  DEPOSIT: 'coc',
  SELL: 'ban',
  SYSTEM: 'he-thong',
};

const INITIAL_PRODUCTS = [
  {
    id: '37490',
    brand: 'FUJI',
    name: 'X-M5',
    specs: 'Black, Body, No box / 37490',
    price: 21990000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#000000',
    box: false,
    lens: false,
    serial: '37428',
    shotCount: '5.000',
    accessories: 'Sạc, Dây đeo, Pin',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 97,
    description: 'Ngoại hình nhiều vết trầy, báng cầm hơi ố vàng, đế máy cấn nhẹ.',
    dateAdded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '37491',
    brand: 'FUJI',
    name: 'X-T5',
    specs: 'Silver, Body, Fullbox / 37491',
    price: 38500000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#c0c0c0',
    box: true,
    lens: false,
    serial: '38192',
    shotCount: '2.500',
    accessories: 'Fullbox phụ kiện zin hãng',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 99,
    description: 'Như mới không tì vết, hàng chính hãng còn bảo hành dài.',
    dateAdded: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '37492',
    brand: 'FUJI',
    name: 'X-T30 II',
    specs: 'Black, Kit 15-45mm, Fullbox / 37492',
    price: 23200000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#000000',
    box: true,
    lens: true,
    serial: '32019',
    shotCount: '12.000',
    accessories: 'Sạc, Pin, Dây đeo, Thẻ nhớ 64GB',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 95,
    description: 'Xước dăm nhẹ góc máy, hoạt động hoàn hảo, kính lens sạch không mốc.',
    dateAdded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '37493',
    brand: 'FUJI',
    name: 'X-S20',
    specs: 'Black, Body, Fullbox / 37493',
    price: 29900000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#000000',
    box: true,
    lens: false,
    serial: '42018',
    shotCount: '800',
    accessories: 'Fullbox, sạc zin, 2 pin, thẻ 128GB',
    location: '74 Bà Triệu',
    staff: 'Trần Văn Nam',
    condition: 99,
    description: 'Hàng lướt cực đẹp, số shot cực ít, hoàn toàn như mới.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '37494',
    brand: 'FUJI',
    name: 'X100VI',
    specs: 'Silver, Fullbox, 100% / 37494',
    price: 49500000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#c0c0c0',
    box: true,
    lens: true,
    serial: '55012',
    shotCount: '50',
    accessories: 'Fullbox, tặng bao da zin',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 100,
    description: 'Hàng sưu tầm vừa đập hộp, mới test chụp vài shot.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '37495',
    brand: 'FUJI',
    name: 'X-Pro3',
    specs: 'Dura Black, Body, No box / 37495',
    price: 32500000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#3a3a3a',
    box: false,
    lens: false,
    serial: '19827',
    shotCount: '15.000',
    accessories: 'Sạc, 1 Pin zin',
    location: '42 Huỳnh Thúc Kháng',
    staff: 'Đỗ Minh Trí',
    condition: 93,
    description: 'Màu Dura Black sang trọng, xước mạ nhẹ báng cầm, màn hình phụ hoạt động tốt.',
    dateAdded: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '38490',
    brand: 'SONY',
    name: 'A7 IV',
    specs: 'Black, Body, Fullbox / 38490',
    price: 43200000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#000000',
    box: true,
    lens: false,
    serial: '66182',
    shotCount: '6.000',
    accessories: 'Fullbox đầy đủ',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 98,
    description: 'Máy đẹp keng không tì vết, hoạt động hoàn hảo.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '39490',
    brand: 'CANON',
    name: 'EOS R6 II',
    specs: 'Black, Body, Fullbox / 39490',
    price: 52000000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#000000',
    box: true,
    lens: false,
    serial: '77281',
    shotCount: '4.500',
    accessories: 'Fullbox phụ kiện zin',
    location: '74 Bà Triệu',
    staff: 'Trần Văn Nam',
    condition: 98,
    description: 'Chụp cưới, sự kiện siêu chất, máy sạch đẹp như mới.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '40490',
    brand: 'DJI',
    name: 'Osmo Pocket 3 Creator Combo',
    specs: 'Black, Full Combo, Fullbox / 40490',
    price: 13990000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#000000',
    box: true,
    lens: true,
    serial: '88102',
    shotCount: '0',
    accessories: 'Đầy đủ phụ kiện trong Creator Combo',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 99,
    description: 'Fullbox như mới, gimbal 3 trục hoạt động hoàn hảo, âm thanh thu cực ấm.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '41490',
    brand: 'NIKON',
    name: 'Zfc',
    specs: 'Silver-Black, Kit 16-50mm, Fullbox / 41490',
    price: 16500000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#c0c0c0',
    box: true,
    lens: true,
    serial: '99281',
    shotCount: '1.800',
    accessories: 'Fullbox phụ kiện zin, thẻ 64GB',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 98,
    description: 'Ngoại hình hoài cổ cực đẹp, không trầy xước, thấu kính trong vắt.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '42490',
    brand: 'RICOH',
    name: 'GR III',
    specs: 'Black, Body, No box / 42490',
    price: 24500000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#000000',
    box: false,
    lens: true,
    serial: '10291',
    shotCount: '8.500',
    accessories: 'Sạc, 2 Pin, dây đeo tay da',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 96,
    description: 'Bản quốc tế chụp snapshot đường phố đỉnh cao, xước dăm nhẹ đế máy.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '43490',
    brand: 'SIGMA',
    name: '24-70mm f/2.8 DG DN Art (Sony E)',
    specs: 'Black, Lens, Fullbox / 43490',
    price: 18500000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#000000',
    box: true,
    lens: true,
    serial: '88271',
    shotCount: '0',
    accessories: 'Fullbox, cáp trước sau, hood zin, kính lọc UV',
    location: '74 Bà Triệu',
    staff: 'Trần Văn Nam',
    condition: 97,
    description: 'Lens Art sắc nét, kính đẹp không mốc rễ hay trầy xước, vòng cao su chắc chắn.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '44490',
    brand: 'TAMRON',
    name: '28-75mm f/2.8 Di III VXD G2 (Sony E)',
    specs: 'Black, Lens, Fullbox / 44490',
    price: 16900000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#000000',
    box: true,
    lens: true,
    serial: '77291',
    shotCount: '0',
    accessories: 'Fullbox phụ kiện đi kèm',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 99,
    description: 'Thế hệ 2 lấy nét cực nhanh và êm, kính trong vắt như mới.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '45490',
    brand: 'VILTROX',
    name: '85mm f/1.8 II STM (Nikon Z)',
    specs: 'Black, Lens, Fullbox / 45490',
    price: 7500000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#000000',
    box: true,
    lens: true,
    serial: '55291',
    shotCount: '0',
    accessories: 'Fullbox, hood, túi vải đựng lens',
    location: '42 Huỳnh Thúc Kháng',
    staff: 'Đỗ Minh Trí',
    condition: 98,
    description: 'Lens chân dung khẩu lớn giá rẻ, xóa phông mịn màng, hoạt động hoàn hảo.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '46490',
    brand: 'LEICA',
    name: 'Leica Q2',
    specs: 'Black, Compact, Fullbox / 46490',
    price: 95000000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#000000',
    box: true,
    lens: true,
    serial: '18271',
    shotCount: '3.000',
    accessories: 'Fullbox đầy đủ phụ kiện Leica',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 99,
    description: 'Cảm biến Full Frame 47.3MP, ống kính Summilux 28mm f/1.7, thiết kế hoàn hảo.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '47490',
    brand: 'HASSELBLAD',
    name: 'X2D 100C',
    specs: 'Dura Grey, Medium Format, Fullbox / 47490',
    price: 180000000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#3a3a3a',
    box: true,
    lens: false,
    serial: '22819',
    shotCount: '800',
    accessories: 'Fullbox, sạc đôi, 2 pin zin, dây đeo da',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 99,
    description: 'Medium Format 100MP, SSD 1TB tích hợp, lấy nét theo pha PDAF vượt trội.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '48490',
    brand: 'PHỤ KIỆN',
    name: 'Chân máy Peak Design Carbon Travel Tripod',
    specs: 'Black, Carbon, Fullbox / 48490',
    price: 12500000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#000000',
    box: true,
    lens: false,
    serial: 'PD-8291',
    shotCount: '0',
    accessories: 'Túi đựng tripod, lục giác tháo mở, ngàm đa năng',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 98,
    description: 'Tripod Carbon siêu bền nhẹ, chịu lực tốt, xếp siêu gọn cho nhiếp ảnh gia.',
    dateAdded: new Date().toISOString()
  },

  // ── SONY ──
  {
    id: '49490',
    brand: 'SONY',
    name: 'A7C II',
    specs: 'Silver, Body, Fullbox / 49490',
    price: 46500000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#c0c0c0',
    box: true,
    lens: false,
    serial: '70192',
    shotCount: '3.200',
    accessories: 'Fullbox đầy đủ phụ kiện Sony',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 97,
    description: 'Màu Silver sang trọng, AI AF xịn, body nhỏ gọn, hoạt động hoàn hảo.',
    dateAdded: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '50490',
    brand: 'SONY',
    name: 'ZV-E10 II',
    specs: 'Black, Body, Fullbox / 50490',
    price: 14900000,
    status: PRODUCT_STATUS.DEPOSITED,
    color: '#000000',
    box: true,
    lens: false,
    serial: '71029',
    shotCount: '500',
    accessories: 'Fullbox, thẻ nhớ 64GB, dây đeo',
    location: '74 Bà Triệu',
    staff: 'Trần Văn Nam',
    condition: 99,
    description: 'Máy quay vlog APS-C mới nhất, như mới đập hộp, AF bắt mắt cực nhanh.',
    dateAdded: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    depositInfo: {
      staff: 'Trần Văn Nam',
      location: '74 Bà Triệu',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: '51490',
    brand: 'SONY',
    name: 'FX30',
    specs: 'Black, Body, Fullbox / 51490',
    price: 36900000,
    status: PRODUCT_STATUS.SOLD,
    color: '#000000',
    box: true,
    lens: false,
    serial: '72910',
    shotCount: '1.200',
    accessories: 'Fullbox, tay cầm XLR-H1, 2 pin',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 98,
    description: 'Cinema Line APS-C quay phim cực chất, ổn định màu sắc, AF theo mắt.',
    dateAdded: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    sellInfo: {
      staff: 'Lê Hồng Quân',
      location: '193 Giảng Võ',
      date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
    }
  },

  // ── CANON ──
  {
    id: '52490',
    brand: 'CANON',
    name: 'EOS R50',
    specs: 'White, Kit 18-45mm, Fullbox / 52490',
    price: 15500000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#f5f5f5',
    box: true,
    lens: true,
    serial: '80291',
    shotCount: '2.100',
    accessories: 'Fullbox, thẻ nhớ 32GB, túi máy',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 98,
    description: 'Màu White nổi bật, kit lens 18-45mm sắc nét, phù hợp người mới bắt đầu.',
    dateAdded: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '53490',
    brand: 'CANON',
    name: 'EOS R5 Mark II',
    specs: 'Black, Body, Fullbox / 53490',
    price: 88000000,
    status: PRODUCT_STATUS.SOLD,
    color: '#000000',
    box: true,
    lens: false,
    serial: '81029',
    shotCount: '4.800',
    accessories: 'Fullbox đầy đủ, thêm grip BG-R10',
    location: '74 Bà Triệu',
    staff: 'Trần Văn Nam',
    condition: 99,
    description: 'Flagship hybrid quay phim 8K RAW, AF nhân tạo cực mạnh, máy sạch bóng.',
    dateAdded: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    sellInfo: {
      staff: 'Trần Văn Nam',
      location: '74 Bà Triệu',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    }
  },

  // ── DJI ──
  {
    id: '54490',
    brand: 'DJI',
    name: 'Mini 4 Pro Fly More Combo Plus',
    specs: 'Grey, Fly More Combo Plus, Fullbox / 54490',
    price: 21500000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#3a3a3a',
    box: true,
    lens: true,
    serial: '89201',
    shotCount: '0',
    accessories: 'Đầy đủ Fly More Combo Plus: sạc hub, 3 pin, túi đeo',
    location: '42 Huỳnh Thúc Kháng',
    staff: 'Đỗ Minh Trí',
    condition: 99,
    description: 'Drone 4K HDR siêu gọn, tránh chướng ngại vật 4 chiều, bay 34 phút, fullbox như mới.',
    dateAdded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '55490',
    brand: 'DJI',
    name: 'RS 4 Pro',
    specs: 'Black, Combo, Fullbox / 55490',
    price: 11900000,
    status: PRODUCT_STATUS.DEPOSITED,
    color: '#000000',
    box: true,
    lens: false,
    serial: '90102',
    shotCount: '0',
    accessories: 'Gimbal, focus motor, sạc đa năng, túi vải',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 98,
    description: 'Gimbal chuyên nghiệp tải trọng 4.5kg, bộ nhớ 20GB tích hợp, ổn định tuyệt vời.',
    dateAdded: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    depositInfo: {
      staff: 'Nguyễn Việt Thịnh',
      location: '193 NBK',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  },

  // ── NIKON ──
  {
    id: '56490',
    brand: 'NIKON',
    name: 'Z30',
    specs: 'Black, Kit 16-50mm, Fullbox / 56490',
    price: 13500000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#000000',
    box: true,
    lens: true,
    serial: '10029',
    shotCount: '3.500',
    accessories: 'Fullbox, pin EN-EL25, sạc zin',
    location: '74 Bà Triệu',
    staff: 'Trần Văn Nam',
    condition: 96,
    description: 'Máy vlog không viewfinder, flip màn hình cực tiện, AF bám mắt mượt mà.',
    dateAdded: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '57490',
    brand: 'NIKON',
    name: 'Z6 III',
    specs: 'Black, Body, Fullbox / 57490',
    price: 58000000,
    status: PRODUCT_STATUS.DEPOSITED,
    color: '#000000',
    box: true,
    lens: false,
    serial: '11209',
    shotCount: '2.900',
    accessories: 'Fullbox đầy đủ, thêm grip MB-N14',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 99,
    description: 'Cảm biến BSI CMOS 24.5MP, quay 6K RAW nội 12-bit, EVF 5.76 triệu điểm đỉnh nhất phân khúc.',
    dateAdded: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    depositInfo: {
      staff: 'Lê Hồng Quân',
      location: '193 Giảng Võ',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  },

  // ── RICOH ──
  {
    id: '58490',
    brand: 'RICOH',
    name: 'GR IIIx',
    specs: 'Black, Body, No box / 58490',
    price: 27900000,
    status: PRODUCT_STATUS.DEPOSITED,
    color: '#000000',
    box: false,
    lens: true,
    serial: '20019',
    shotCount: '6.200',
    accessories: 'Sạc, 2 Pin DB-110, dây đeo tay da cao cấp',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 95,
    description: 'Ống kính 40mm f/2.8 góc trung tính, ngoại hình xước dăm đế máy nhưng thấu kính sạch hoàn toàn.',
    dateAdded: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    depositInfo: {
      staff: 'Nguyễn Việt Thịnh',
      location: '193 NBK',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  },

  // ── SIGMA ──
  {
    id: '59490',
    brand: 'SIGMA',
    name: '18-50mm f/2.8 DC DN Contemporary (Fuji X)',
    specs: 'Black, Lens, Fullbox / 59490',
    price: 9800000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#000000',
    box: true,
    lens: true,
    serial: '91028',
    shotCount: '0',
    accessories: 'Fullbox, nắp trước sau zin, hood, túi đựng',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 99,
    description: 'Lens zoom khẩu lớn APS-C nhỏ gọn bậc nhất cho Fuji X, kính trong vắt không tì vết.',
    dateAdded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },

  // ── TAMRON ──
  {
    id: '60490',
    brand: 'TAMRON',
    name: '17-28mm f/2.8 Di III RXD (Sony E)',
    specs: 'Black, Lens, Fullbox / 60490',
    price: 14200000,
    status: PRODUCT_STATUS.SOLD,
    color: '#000000',
    box: true,
    lens: true,
    serial: '80291',
    shotCount: '0',
    accessories: 'Fullbox phụ kiện zin, kính lọc UV 67mm',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 97,
    description: 'Wide-angle zoom khẩu f/2.8, siêu nhẹ chỉ 420g, kính đẹp không mốc.',
    dateAdded: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    sellInfo: {
      staff: 'Nguyễn Việt Thịnh',
      location: '193 NBK',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    }
  },

  // ── VILTROX ──
  {
    id: '61490',
    brand: 'VILTROX',
    name: '56mm f/1.4 AF STM (Fuji X)',
    specs: 'Black, Lens, Fullbox / 61490',
    price: 5200000,
    status: PRODUCT_STATUS.SOLD,
    color: '#000000',
    box: true,
    lens: true,
    serial: '62019',
    shotCount: '0',
    accessories: 'Fullbox, hood, túi đựng lens, nắp UV',
    location: '42 Huỳnh Thúc Kháng',
    staff: 'Đỗ Minh Trí',
    condition: 98,
    description: 'Chân dung 56mm f/1.4 cho Fuji X, bokeh mịn đẹp, AF nhanh im lặng, như mới.',
    dateAdded: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    sellInfo: {
      staff: 'Đỗ Minh Trí',
      location: '42 Huỳnh Thúc Kháng',
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    }
  },

  // ── LEICA ──
  {
    id: '62490',
    brand: 'LEICA',
    name: 'M11 Monochrom',
    specs: 'Black Paint, Rangefinder, Fullbox / 62490',
    price: 210000000,
    status: PRODUCT_STATUS.SOLD,
    color: '#1a1a1a',
    box: true,
    lens: false,
    serial: '19920',
    shotCount: '1.500',
    accessories: 'Fullbox đầy đủ phụ kiện Leica, dây đeo da Leica gốc',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 99,
    description: 'Cảm biến 60MP Monochrom thuần đen trắng độc nhất vô nhị, độ phân giải dải động đỉnh cao.',
    dateAdded: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    sellInfo: {
      staff: 'Lê Hồng Quân',
      location: '193 Giảng Võ',
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
    }
  },

  // ── HASSELBLAD ──
  {
    id: '63490',
    brand: 'HASSELBLAD',
    name: '907X 50C',
    specs: 'Silver, Medium Format, Fullbox / 63490',
    price: 145000000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#c0c0c0',
    box: true,
    lens: false,
    serial: '30192',
    shotCount: '400',
    accessories: 'Fullbox, ngàm XCD adapter, sạc zin',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 99,
    description: 'Thiết kế tối giản iconic, cảm biến 50MP Medium Format, hàng hiếm thị trường Việt Nam.',
    dateAdded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },

  // ── FUJI bổ sung ──
  {
    id: '64490',
    brand: 'FUJI',
    name: 'X-E4',
    specs: 'Silver, Body, No box / 64490',
    price: 18900000,
    status: PRODUCT_STATUS.SOLD,
    color: '#c0c0c0',
    box: false,
    lens: false,
    serial: '29182',
    shotCount: '9.000',
    accessories: 'Sạc, 1 Pin zin, ốp da nâu aftermarket',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 93,
    description: 'Thiết kế mỏng dẹp hoài cổ, film simulation đỉnh cao, xước dăm nhẹ nắp sau.',
    dateAdded: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    sellInfo: {
      staff: 'Lê Hồng Quân',
      location: '193 Giảng Võ',
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: '65490',
    brand: 'FUJI',
    name: 'GFX 50S II',
    specs: 'Black, Medium Format Body, Fullbox / 65490',
    price: 72000000,
    status: PRODUCT_STATUS.DEPOSITED,
    color: '#000000',
    box: true,
    lens: false,
    serial: '30029',
    shotCount: '2.200',
    accessories: 'Fullbox, sạc đôi, 2 pin NP-T125 zin',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 97,
    description: 'Medium Format 51.4MP IBIS, màu sắc Fuji chân thực tuyệt vời, xước dăm rất nhẹ đáy máy.',
    dateAdded: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    depositInfo: {
      staff: 'Nguyễn Việt Thịnh',
      location: '193 NBK',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
    }
  },

  // ── PHỤ KIỆN bổ sung ──
  {
    id: '66490',
    brand: 'PHỤ KIỆN',
    name: 'Flash Godox V1 Pro (Sony)',
    specs: 'Black, Flash, Fullbox / 66490',
    price: 4200000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#000000',
    box: true,
    lens: false,
    serial: 'GX-V1P-9201',
    shotCount: '0',
    accessories: 'Fullbox, pin Li-ion VB26A, sạc nhanh USB-C',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 99,
    description: 'Flash đầu xoay tròn 76Ws, HSS 1/8000s, TTL Sony, sạc nhanh đầy pin 1.5 tiếng, như mới.',
    dateAdded: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '67490',
    brand: 'PHỤ KIỆN',
    name: 'Túi máy Lowepro Flipside 400 AW III',
    specs: 'Black, Backpack, Fullbox / 67490',
    price: 3100000,
    status: PRODUCT_STATUS.SOLD,
    color: '#000000',
    box: true,
    lens: false,
    serial: 'LP-FA400-8291',
    shotCount: '0',
    accessories: 'Túi mưa AW, khoá TSA, móc túi phụ',
    location: '74 Bà Triệu',
    staff: 'Trần Văn Nam',
    condition: 96,
    description: 'Ba lô đựng máy ảnh + laptop 15", vải chống nước, ngăn chứa rộng rãi, xước dăm nhẹ khoá kéo.',
    dateAdded: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
    sellInfo: {
      staff: 'Trần Văn Nam',
      location: '74 Bà Triệu',
      date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: '68490',
    brand: 'PHỤ KIỆN',
    name: 'Kính lọc Kase Wolverine CPL 82mm',
    specs: 'Silver, Filter, Fullbox / 68490',
    price: 1850000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#c0c0c0',
    box: true,
    lens: false,
    serial: 'KS-CPL82-1029',
    shotCount: '0',
    accessories: 'Hộp nhôm đựng filter, khăn lau kính',
    location: '42 Huỳnh Thúc Kháng',
    staff: 'Đỗ Minh Trí',
    condition: 99,
    description: 'Kính CPL cao cấp Schott MRC Nano 28 lớp phủ, khử phản xạ đỉnh cao, kính không trầy.',
    dateAdded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_HISTORY = [
  // ── Hôm nay / gần đây nhất ──
  {
    id: 'hist_01',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Đỗ Minh Trí',
    location: '42 Huỳnh Thúc Kháng',
    productName: 'Kase Wolverine CPL 82mm',
    serial: 'KS-CPL82-1029',
    details: 'Nhập kho kính lọc Kase Wolverine CPL 82mm ngoại hình 99% bởi Đỗ Minh Trí.'
  },
  {
    id: 'hist_02',
    type: LOG_TYPE.DEPOSIT,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Nguyễn Việt Thịnh',
    location: '193 NBK',
    productName: 'RICOH GR IIIx',
    serial: '20019',
    details: 'Xác nhận khách nhận cọc máy RICOH GR IIIx (Serial: 20019) cho khách của Nguyễn Việt Thịnh tại chi nhánh 193 NBK.'
  },
  {
    id: 'hist_03',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'HASSELBLAD 907X 50C',
    serial: '30192',
    details: 'Nhập kho máy cũ HASSELBLAD 907X 50C ngoại hình 99% bởi Lê Hồng Quân.'
  },
  {
    id: 'hist_04',
    type: LOG_TYPE.DEPOSIT,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'NIKON Z6 III',
    serial: '11209',
    details: 'Xác nhận khách nhận cọc máy NIKON Z6 III (Serial: 11209) cho khách của Lê Hồng Quân tại chi nhánh 193 Giảng Võ.'
  },
  {
    id: 'hist_05',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'DJI Mini 4 Pro Fly More Combo Plus',
    serial: '89201',
    details: 'Nhập kho máy DJI Mini 4 Pro Fly More Combo Plus ngoại hình 99% bởi Lê Hồng Quân.'
  },
  {
    id: 'hist_06',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Nguyễn Việt Thịnh',
    location: '193 NBK',
    productName: 'DJI Osmo Pocket 3 Creator Combo',
    serial: '88102',
    details: 'Nhập kho máy DJI Osmo Pocket 3 Creator Combo ngoại hình 99%.'
  },
  {
    id: 'hist_07',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Trần Văn Nam',
    location: '74 Bà Triệu',
    productName: 'SONY ZV-E10 II',
    serial: '71029',
    details: 'Nhập kho máy cũ SONY ZV-E10 II ngoại hình 99% bởi Trần Văn Nam.'
  },
  {
    id: 'hist_08',
    type: LOG_TYPE.DEPOSIT,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Trần Văn Nam',
    location: '74 Bà Triệu',
    productName: 'SONY ZV-E10 II',
    serial: '71029',
    details: 'Xác nhận khách nhận cọc máy SONY ZV-E10 II (Serial: 71029) cho khách của Trần Văn Nam tại chi nhánh 74 Bà Triệu.'
  },
  {
    id: 'hist_09',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Nguyễn Việt Thịnh',
    location: '193 NBK',
    productName: 'FUJI X-M5',
    serial: '37428',
    details: 'Nhập kho máy cũ Fuji X-M5 ngoại hình 97%.'
  },
  {
    id: 'hist_10',
    type: LOG_TYPE.DEPOSIT,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Nguyễn Việt Thịnh',
    location: '193 NBK',
    productName: 'DJI RS 4 Pro',
    serial: '90102',
    details: 'Xác nhận khách nhận cọc máy DJI RS 4 Pro (Serial: 90102) cho khách của Nguyễn Việt Thịnh tại chi nhánh 193 NBK.'
  },
  {
    id: 'hist_11',
    type: LOG_TYPE.DEPOSIT,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Nguyễn Việt Thịnh',
    location: '193 NBK',
    productName: 'FUJI GFX 50S II',
    serial: '30029',
    details: 'Xác nhận khách nhận cọc máy FUJI GFX 50S II (Serial: 30029) cho khách của Nguyễn Việt Thịnh tại chi nhánh 193 NBK.'
  },
  {
    id: 'hist_12',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Nguyễn Việt Thịnh',
    location: '193 NBK',
    productName: 'Flash Godox V1 Pro (Sony)',
    serial: 'GX-V1P-9201',
    details: 'Nhập kho Flash Godox V1 Pro (Sony) ngoại hình 99% bởi Nguyễn Việt Thịnh.'
  },
  {
    id: 'hist_13',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'NIKON Z6 III',
    serial: '11209',
    details: 'Nhập kho máy cũ NIKON Z6 III ngoại hình 99% bởi Lê Hồng Quân.'
  },
  {
    id: 'hist_14',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'FUJI GFX 50S II',
    serial: '30029',
    details: 'Nhập kho máy cũ FUJI GFX 50S II ngoại hình 97% bởi Lê Hồng Quân.'
  },
  {
    id: 'hist_15',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'DJI RS 4 Pro',
    serial: '90102',
    details: 'Nhập kho gimbal DJI RS 4 Pro ngoại hình 98% bởi Lê Hồng Quân.'
  },
  {
    id: 'hist_16',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Nguyễn Việt Thịnh',
    location: '193 NBK',
    productName: 'RICOH GR IIIx',
    serial: '20019',
    details: 'Nhập kho máy cũ RICOH GR IIIx ngoại hình 95% bởi Nguyễn Việt Thịnh.'
  },
  {
    id: 'hist_17',
    type: LOG_TYPE.SELL,
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Đỗ Minh Trí',
    location: '42 Huỳnh Thúc Kháng',
    productName: 'VILTROX 56mm f/1.4 AF STM (Fuji X)',
    serial: '62019',
    details: 'Xác nhận đã bán lens VILTROX 56mm f/1.4 AF STM (Serial: 62019) cho khách, thực hiện bởi Đỗ Minh Trí tại chi nhánh 42 Huỳnh Thúc Kháng.'
  },
  {
    id: 'hist_18',
    type: LOG_TYPE.SELL,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Trần Văn Nam',
    location: '74 Bà Triệu',
    productName: 'CANON EOS R5 Mark II',
    serial: '81029',
    details: 'Xác nhận đã bán máy CANON EOS R5 Mark II (Serial: 81029) cho khách, thực hiện bởi Trần Văn Nam tại chi nhánh 74 Bà Triệu.'
  },
  {
    id: 'hist_19',
    type: LOG_TYPE.SYSTEM,
    date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Hệ thống',
    location: '193 Giảng Võ',
    productName: 'SONY A7 IV',
    serial: '66182',
    details: 'Hệ thống tự động hủy cọc quá hạn 1 tuần (đặt bởi Lê Hồng Quân tại 193 Giảng Võ). Máy SONY A7 IV đã trả về trạng thái Còn hàng.'
  },
  {
    id: 'hist_20',
    type: LOG_TYPE.SELL,
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Nguyễn Việt Thịnh',
    location: '193 NBK',
    productName: 'TAMRON 17-28mm f/2.8 Di III RXD (Sony E)',
    serial: '80291',
    details: 'Xác nhận đã bán lens TAMRON 17-28mm f/2.8 (Serial: 80291) cho khách, thực hiện bởi Nguyễn Việt Thịnh tại chi nhánh 193 NBK.'
  },
  {
    id: 'hist_21',
    type: LOG_TYPE.SELL,
    date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Trần Văn Nam',
    location: '74 Bà Triệu',
    productName: 'PHỤ KIỆN Lowepro Flipside 400 AW III',
    serial: 'LP-FA400-8291',
    details: 'Xác nhận đã bán túi Lowepro Flipside 400 AW III (Serial: LP-FA400-8291) cho khách, thực hiện bởi Trần Văn Nam tại chi nhánh 74 Bà Triệu.'
  },
  {
    id: 'hist_22',
    type: LOG_TYPE.SELL,
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'SONY FX30',
    serial: '72910',
    details: 'Xác nhận đã bán máy SONY FX30 (Serial: 72910) cho khách, thực hiện bởi Lê Hồng Quân tại chi nhánh 193 Giảng Võ.'
  },
  {
    id: 'hist_23',
    type: LOG_TYPE.SELL,
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'LEICA M11 Monochrom',
    serial: '19920',
    details: 'Xác nhận đã bán máy LEICA M11 Monochrom (Serial: 19920) cho khách, thực hiện bởi Lê Hồng Quân tại chi nhánh 193 Giảng Võ.'
  },
  {
    id: 'hist_24',
    type: LOG_TYPE.SYSTEM,
    date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Hệ thống',
    location: '193 NBK',
    productName: 'FUJI X-T5',
    serial: '38192',
    details: 'Hệ thống tự động hủy cọc quá hạn 1 tuần (đặt bởi Nguyễn Việt Thịnh tại 193 NBK). Máy FUJI X-T5 đã trả về trạng thái Còn hàng.'
  },
  {
    id: 'hist_25',
    type: LOG_TYPE.SELL,
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'FUJI X-E4',
    serial: '29182',
    details: 'Xác nhận đã bán máy FUJI X-E4 (Serial: 29182) cho khách, thực hiện bởi Lê Hồng Quân tại chi nhánh 193 Giảng Võ.'
  },
  {
    id: 'hist_26',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Trần Văn Nam',
    location: '74 Bà Triệu',
    productName: 'CANON EOS R5 Mark II',
    serial: '81029',
    details: 'Nhập kho máy cũ CANON EOS R5 Mark II ngoại hình 99% bởi Trần Văn Nam.'
  },
  {
    id: 'hist_27',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Trần Văn Nam',
    location: '74 Bà Triệu',
    productName: 'PHỤ KIỆN Lowepro Flipside 400 AW III',
    serial: 'LP-FA400-8291',
    details: 'Nhập kho túi Lowepro Flipside 400 AW III ngoại hình 96% bởi Trần Văn Nam.'
  },
  {
    id: 'hist_28',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'FUJI X-E4',
    serial: '29182',
    details: 'Nhập kho máy cũ FUJI X-E4 ngoại hình 93% bởi Lê Hồng Quân.'
  },
  {
    id: 'hist_29',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Đỗ Minh Trí',
    location: '42 Huỳnh Thúc Kháng',
    productName: 'VILTROX 56mm f/1.4 AF STM (Fuji X)',
    serial: '62019',
    details: 'Nhập kho lens VILTROX 56mm f/1.4 AF STM (Fuji X) ngoại hình 98% bởi Đỗ Minh Trí.'
  },
  {
    id: 'hist_30',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'SONY FX30',
    serial: '72910',
    details: 'Nhập kho máy cũ SONY FX30 Cinema Line ngoại hình 98% bởi Lê Hồng Quân.'
  },
  {
    id: 'hist_31',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'LEICA M11 Monochrom',
    serial: '19920',
    details: 'Nhập kho máy cũ LEICA M11 Monochrom ngoại hình 99% bởi Lê Hồng Quân.'
  },
  {
    id: 'hist_32',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Nguyễn Việt Thịnh',
    location: '193 NBK',
    productName: 'TAMRON 17-28mm f/2.8 Di III RXD (Sony E)',
    serial: '80291',
    details: 'Nhập kho lens TAMRON 17-28mm f/2.8 Di III RXD (Sony E) ngoại hình 97% bởi Nguyễn Việt Thịnh.'
  }
];

// FIX #3: Reusable status label/class lookup — eliminates repeated if-else chains
const STATUS_DISPLAY = {
  [PRODUCT_STATUS.IN_STOCK]:  { text: 'Còn hàng', cls: 'status-con' },
  [PRODUCT_STATUS.DEPOSITED]: { text: 'Đã cọc',   cls: 'status-coc' },
  [PRODUCT_STATUS.SOLD]:      { text: 'Đã bán',   cls: 'status-ban' },
};

const LOG_DISPLAY = {
  [LOG_TYPE.IMPORT]:  { text: 'NHẬP KHO', cls: 'type-nhap' },
  [LOG_TYPE.DEPOSIT]: { text: 'CỌC MÁY',  cls: 'type-coc'  },
  [LOG_TYPE.SELL]:    { text: 'ĐÃ BÁN',   cls: 'type-ban'  },
  [LOG_TYPE.SYSTEM]:  { text: 'HỆ THỐNG', cls: 'type-system' },
};

// FIX #8: Download utility extracted out of JSX/handlers
function triggerJsonDownload(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function App() {
  // ════════════════════════════════════════════════════
  // 1. STATE CONFIGURATION
  // ════════════════════════════════════════════════════
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem('nippon_camera_products');
    return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
  });

  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem('nippon_camera_history');
    return stored ? JSON.parse(stored) : INITIAL_HISTORY;
  });

  const [currentTab, setCurrentTab] = useState('check-gia');
  const [currentBrand, setCurrentBrand] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);

  // Modals state
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [mDepStaff, setMDepStaff] = useState(STAFFS[0]);
  const [mDepLocation, setMDepLocation] = useState(LOCATIONS[0]);

  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [mSellStaff, setMSellStaff] = useState(STAFFS[0]);
  const [mSellLocation, setMSellLocation] = useState(LOCATIONS[0]);

  // Entry form state (NHẬP LIỆU)
  const [fBrand, setFBrand] = useState('FUJI');
  const [fName, setFName] = useState('');
  const [fColor, setFColor] = useState('#000000');
  const [fPrice, setFPrice] = useState('');
  const [fSerial, setFSerial] = useState('');
  const [fShot, setFShot] = useState('');
  const [fLocation, setFLocation] = useState(LOCATIONS[0]);
  const [fStaff, setFStaff] = useState(STAFFS[0]);
  const [fCondition, setFCondition] = useState(97);
  const [fBox, setFBox] = useState(false);
  const [fLens, setFLens] = useState(false);
  const [fAccessories, setFAccessories] = useState('');
  const [fDesc, setFDesc] = useState('');

  const [toast, setToast] = useState(null);

  // FIX #5 & #8: Refs instead of DOM queries
  const toastTimerRef = useRef(null);
  const importFileRef = useRef(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('nippon_camera_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('nippon_camera_history', JSON.stringify(history));
  }, [history]);

  // FIX #5: Clear toast timer on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // FIX #1 & #7: Pure map — collect expired logs first, then batch-update both states
  useEffect(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const now = new Date().toISOString();
    const expiredLogs = [];

    const updatedProducts = products.map(p => {
      if (p.status === PRODUCT_STATUS.DEPOSITED && p.depositInfo?.date) {
        const depositTime = new Date(p.depositInfo.date).getTime();
        if (depositTime < oneWeekAgo) {
          expiredLogs.push({
            id: `hist_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            type: LOG_TYPE.SYSTEM,
            date: now,
            staff: 'Hệ thống',
            location: p.depositInfo.location,
            productName: `${p.brand} ${p.name}`,
            serial: p.serial,
            details: `Hệ thống tự động hủy cọc quá hạn 1 tuần (đặt bởi ${p.depositInfo.staff} tại ${p.depositInfo.location})`
          });
          // FIX: destructure instead of mutating with delete
          const { depositInfo: _ignored, ...rest } = p;
          return { ...rest, status: PRODUCT_STATUS.IN_STOCK };
        }
      }
      return p;
    });

    if (expiredLogs.length > 0) {
      setProducts(updatedProducts);
      setHistory(prev => [...expiredLogs, ...prev]);
    }
    // products is stable at mount (read from localStorage before this effect runs).
    // Intentionally run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helpers
  // FIX #5: Clear existing timer before starting a new one — no duplicate timers
  const showToast = (message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  };

  const formatMoneyRaw = (num) => num.toLocaleString('vi-VN');
  const formatMoney = (num) => num.toLocaleString('vi-VN') + ' đ';

  const formatDate = (isoStr) => {
    const d = new Date(isoStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const addLog = (type, staff, location, productName, serial, details) => {
    const newLog = {
      id: `hist_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type,
      date: new Date().toISOString(),
      staff,
      location,
      productName,
      serial,
      details
    };
    setHistory(prev => [newLog, ...prev]);
  };

  // ════════════════════════════════════════════════════
  // 2. TRANSACTION LOGIC
  // ════════════════════════════════════════════════════

  // FIX #1: No setState calls inside .map() — derive updated product, then set states separately
  const handleConfirmDeposit = (e) => {
    e.preventDefault();
    if (!currentProduct) return;

    const depositInfo = { staff: mDepStaff, location: mDepLocation, date: new Date().toISOString() };
    let updatedProduct;

    setProducts(prev => prev.map(p => {
      if (p.id === currentProduct.id) {
        updatedProduct = { ...p, status: PRODUCT_STATUS.DEPOSITED, depositInfo };
        return updatedProduct;
      }
      return p;
    }));

    const target = { ...currentProduct, status: PRODUCT_STATUS.DEPOSITED, depositInfo };
    setCurrentProduct(target);

    addLog(
      LOG_TYPE.DEPOSIT,
      mDepStaff,
      mDepLocation,
      `${currentProduct.brand} ${currentProduct.name}`,
      currentProduct.serial,
      `Xác nhận khách nhận cọc máy ${currentProduct.brand} ${currentProduct.name} (Serial: ${currentProduct.serial}) cho khách của ${mDepStaff} tại chi nhánh ${mDepLocation}.`
    );

    showToast(`Đã nhận cọc máy ${currentProduct.name} thành công!`);
    setDepositModalOpen(false);
  };

  // FIX #1: Same pattern for sell
  const handleConfirmSell = (e) => {
    e.preventDefault();
    if (!currentProduct) return;

    const sellInfo = { staff: mSellStaff, location: mSellLocation, date: new Date().toISOString() };

    setProducts(prev => prev.map(p =>
      p.id === currentProduct.id ? { ...p, status: PRODUCT_STATUS.SOLD, sellInfo } : p
    ));

    setCurrentProduct(prev => ({ ...prev, status: PRODUCT_STATUS.SOLD, sellInfo }));

    addLog(
      LOG_TYPE.SELL,
      mSellStaff,
      mSellLocation,
      `${currentProduct.brand} ${currentProduct.name}`,
      currentProduct.serial,
      `Xác nhận đã bán máy ${currentProduct.brand} ${currentProduct.name} (Serial: ${currentProduct.serial}) cho khách, thực hiện bởi ${mSellStaff} tại chi nhánh ${mSellLocation}.`
    );

    showToast(`Đã bán máy ${currentProduct.name} thành công!`);
    setSellModalOpen(false);
  };

  // FIX #1: Functional update + destructure instead of delete mutation
  const handleReleaseProduct = () => {
    if (!currentProduct) return;

    const prevStatus = currentProduct.status;
    // eslint-disable-next-line no-unused-vars
    const { depositInfo: _d, sellInfo: _s, ...rest } = currentProduct;
    const released = { ...rest, status: PRODUCT_STATUS.IN_STOCK };

    setProducts(prev => prev.map(p => p.id === currentProduct.id ? released : p));
    setCurrentProduct(released);

    addLog(
      LOG_TYPE.SYSTEM,
      'Hệ thống',
      currentProduct.location,
      `${currentProduct.brand} ${currentProduct.name}`,
      currentProduct.serial,
      `Reset trạng thái từ ${prevStatus === PRODUCT_STATUS.DEPOSITED ? 'Đã cọc' : 'Đã bán'} về Còn hàng`
    );

    showToast(`Đã giải phóng máy ${currentProduct.name} về trạng thái Còn hàng!`);
  };

  // FIX #6: Save full staff name — was incorrectly trimming to last word only
  const handleAddProduct = (e) => {
    e.preventDefault();
    const newId = 'sku_' + Date.now();
    const newProduct = {
      id: newId,
      brand: fBrand,
      name: fName,
      specs: `${fColor === '#000000' ? 'Black' : 'Color'}, ${fLens ? 'Kit' : 'Body'}, ${fBox ? 'Fullbox' : 'No box'} / ${newId}`,
      price: parseInt(fPrice, 10),
      status: PRODUCT_STATUS.IN_STOCK,
      color: fColor,
      box: fBox,
      lens: fLens,
      serial: fSerial,
      shotCount: fShot,
      accessories: fAccessories,
      location: fLocation,
      staff: fStaff,
      condition: parseInt(fCondition, 10),
      description: fDesc,
      dateAdded: new Date().toISOString()
    };

    setProducts(prev => [...prev, newProduct]);
    addLog(
      LOG_TYPE.IMPORT,
      fStaff,
      fLocation,
      `${fBrand} ${fName}`,
      fSerial,
      `Nhập kho thành công máy cũ ${fBrand} ${fName} ngoại hình ${fCondition}% bởi ${fStaff}.`
    );

    showToast(`Đã nhập kho thành công máy ${fBrand} ${fName}!`);

    setFName('');
    setFPrice('');
    setFSerial('');
    setFShot('');
    setFAccessories('');
    setFDesc('');
    setFBox(false);
    setFLens(false);

    setCurrentBrand(fBrand);
    setCurrentProduct(null);
    setCurrentTab('check-gia');
  };

  const handleExportDB = () => {
    triggerJsonDownload(
      { products, history },
      `nippon_camera_db_${new Date().toISOString().slice(0, 10)}.json`
    );
    showToast('Đã kết xuất dữ liệu bảng giá thành công!');
  };

  const handleImportDB = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const db = JSON.parse(event.target.result);
        if (db && Array.isArray(db.products) && Array.isArray(db.history)) {
          setProducts(db.products);
          setHistory(db.history);
          showToast('Đã nhập cơ sở dữ liệu thành công!', 'success');
        } else {
          showToast('Định dạng file sao lưu không hợp lệ!', 'error');
        }
      } catch {
        showToast('Lỗi khi đọc file sao lưu!', 'error');
      }
    };
    reader.readAsText(file);
  };

  // ════════════════════════════════════════════════════
  // 3. SELECTION & FILTER LOGIC
  // ════════════════════════════════════════════════════

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    if (tab !== 'check-gia') {
      setCurrentBrand(null);
      setCurrentProduct(null);
      setSearchQuery('');
      setPriceFilter('');
    }
  };

  const handleBrandSelect = (brand) => {
    setCurrentBrand(brand);
    setCurrentPage(1);
    setPriceFilter('');
    setCurrentProduct(null);
  };

  // FIX #4: useMemo — filter + pagination only recomputes when relevant state changes
  const filteredProducts = useMemo(() => {
    let result = products;

    if (currentBrand) {
      result = result.filter(p => p.brand === currentBrand);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) || p.specs.toLowerCase().includes(q)
      );
    }
    if (priceFilter === 'duoi-15') {
      result = result.filter(p => p.price < 15000000);
    } else if (priceFilter === '15-30') {
      result = result.filter(p => p.price >= 15000000 && p.price <= 30000000);
    } else if (priceFilter === 'tren-30') {
      result = result.filter(p => p.price > 30000000);
    }

    return result;
  }, [products, currentBrand, searchQuery, priceFilter]);

  const itemsPerPage = 6;

  const { totalPages, pagedProducts } = useMemo(() => {
    const total = Math.ceil(filteredProducts.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    return {
      totalPages: total,
      pagedProducts: filteredProducts.slice(start, start + itemsPerPage),
    };
  }, [filteredProducts, currentPage]);

  // ════════════════════════════════════════════════════
  // 4. RENDERING JSX SUB-VIEWS
  // ════════════════════════════════════════════════════

  return (
    <div className="appContainer">
      <h1 className="appTitle">Bảng giá hàng cũ Nippon Camera</h1>

      {/* Toast popup */}
      {toast && (
        <div className={`toast-notif show toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Bottom Nav Bar */}
      <div className="bottomNavBar" role="navigation" aria-label="Bottom Navigation">
        <button
          className={`bottomNavBtn ${currentTab === 'check-gia' ? 'active' : ''}`}
          data-tab="check-gia"
          onClick={() => handleTabChange('check-gia')}
        >
          CHECK GIÁ
        </button>
        <button
          className={`bottomNavBtn ${currentTab === 'nhap-lieu' ? 'active' : ''}`}
          data-tab="nhap-lieu"
          onClick={() => handleTabChange('nhap-lieu')}
        >
          NHẬP LIỆU
        </button>
        <button
          className={`bottomNavBtn ${currentTab === 'lich-su' ? 'active' : ''}`}
          data-tab="lich-su"
          onClick={() => handleTabChange('lich-su')}
        >
          LỊCH SỬ
        </button>
      </div>

      {/* ── SUBVIEW: CHECK GIÁ ── */}
      {currentTab === 'check-gia' && (
        <div id="check-gia-view">
          {/* Search panel: hide on details view */}
          {!currentProduct && (
            <div className="searchPanel" id="search-panel">
              <span className="searchLabel">Tìm kiếm nhanh</span>
              <div className="searchBox">
                <input
                  type="text"
                  className="searchInput"
                  id="search-input-field"
                  placeholder="Nhập tên máy cần tìm kiếm"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  autoComplete="off"
                />
                {searchQuery.trim() !== '' && (
                  <button
                    type="button"
                    className="clearSearchBtn"
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                  >
                    ✕
                  </button>
                )}
                <span className="searchIconBtn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </span>
              </div>
            </div>
          )}

          {/* 1. BRAND GRID VIEW */}
          {!currentBrand && !currentProduct && (
            <div className="brandGrid" id="brand-grid">
              {Object.keys(BRAND_SLOGANS).map(b => (
                <button
                  key={b}
                  className={`brandCard ${b === 'FUJI' ? 'highlight-brand' : ''}`}
                  onClick={() => handleBrandSelect(b)}
                >
                  {b}
                </button>
              ))}
            </div>
          )}

          {/* 2. SUB-BRAND PRODUCT LIST VIEW */}
          {currentBrand && !currentProduct && (
            <div id="brand-list">
              <div className="brandListHeader">
                <div className="brandBranding">
                  <div className="brandLogoWrapper">
                    {currentBrand === 'FUJI' ? <span className="red-circle-logo"></span> : null}
                    {currentBrand}
                  </div>
                  <p className="brandSlogan">{BRAND_SLOGANS[currentBrand]}</p>
                </div>
                <div className="filterWrapper">
                  <label htmlFor="price-filter-select">Bộ lọc giá</label>
                  <div className="custom-select">
                    <select
                      id="price-filter-select"
                      value={priceFilter}
                      onChange={(e) => {
                        setPriceFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="">Tất cả mức giá</option>
                      <option value="duoi-15">Dưới 15 triệu</option>
                      <option value="15-30">15 - 30 triệu</option>
                      <option value="tren-30">Trên 30 triệu</option>
                    </select>
                  </div>
                </div>
              </div>

              {pagedProducts.length === 0 ? (
                <div className="noProducts">
                  <p>Không tìm thấy sản phẩm cũ nào phù hợp.</p>
                </div>
              ) : (
                <div className="productGrid">
                  {/* FIX #2: STATUS_DISPLAY lookup replaces repeated if-else chains */}
                  {pagedProducts.map(p => {
                    const { text: statusText, cls: statusClass } = STATUS_DISPLAY[p.status] ?? STATUS_DISPLAY[PRODUCT_STATUS.IN_STOCK];

                    return (
                      <div
                        key={p.id}
                        className="productCard"
                        onClick={() => {
                          setCurrentProduct(p);
                          setActiveThumbIndex(0);
                        }}
                      >
                        <div className="productCardImage">
                          <svg className="placeholder-img-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                        <div className="productCardInfo">
                          <div className={`productCardStatus ${statusClass}`}>{statusText}</div>
                          <h3 className="productCardTitle">{p.name}</h3>
                          <p className="productCardSpecs">{p.specs.split(' / ')[0]}</p>
                          <p className="productCardId">SKU: {p.id}</p>
                          <div className="productCardPrice">{formatMoneyRaw(p.price)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Circular Pagination Buttons */}
              {totalPages > 1 && (
                <div className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                    <button
                      key={num}
                      className={`pagBtn ${num === currentPage ? 'active' : ''}`}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. PRODUCT DETAILS VIEW */}
          {currentProduct && (
            <div id="product-detail">
              {/* Breadcrumbs */}
              <div className="breadcrumbs">
                <button
                  className="bcHomeBtn"
                  onClick={() => {
                    setCurrentProduct(null);
                    setCurrentBrand(null);
                  }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                  </svg>
                </button>
                <span className="bcSeparator">/</span>
                <button className="bcBrandBtn" onClick={() => setCurrentProduct(null)}>
                  {currentProduct.brand}
                </button>
                <span className="bcSeparator">/</span>
                <span className="bcProduct">{currentProduct.name}</span>
              </div>

              {/* Grid content */}
              <div className="detailContent">
                {/* Left Specs */}
                <div className="detailSpecs">
                  <h2 className="detailTitle">{currentProduct.name}</h2>
                  <div className="specsGrid">
                    <div className="specsLabel">Màu:</div>
                    <div className="specsValue">
                      <span className="colorDot" style={{ backgroundColor: currentProduct.color }}></span>
                    </div>

                    <div className="specsLabel">Box:</div>
                    <div className="specsValue">
                      {currentProduct.box ? (
                        <span className="statusBadge badgeCheck">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </span>
                      ) : (
                        <span className="statusBadge badgeCross">✕</span>
                      )}
                    </div>

                    <div className="specsLabel">Lens:</div>
                    <div className="specsValue">
                      {currentProduct.lens ? (
                        <span className="statusBadge badgeCheck">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </span>
                      ) : (
                        <span className="statusBadge badgeCross">✕</span>
                      )}
                    </div>

                    <div className="specsLabel">Serial:</div>
                    <div className="specsValue">{currentProduct.serial}</div>

                    <div className="specsLabel">Số shot:</div>
                    <div className="specsValue">{currentProduct.shotCount}</div>

                    <div className="specsLabel">Phụ kiện:</div>
                    <div className="specsValue">{currentProduct.accessories}</div>

                    <div className="specsLabel">Vị trí:</div>
                    <div className="specsValue">{currentProduct.location}</div>
                  </div>

                  <div className="specsStaff">
                    <div className="staffIcon">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                      </svg>
                    </div>
                    <span>{currentProduct.staff}</span>
                  </div>
                </div>

                {/* Right Gallery */}
                <div className="detailGallery">
                  <div className="thumbColumn">
                    {[0, 1, 2].map(idx => (
                      <div
                        key={idx}
                        className={`thumbItem ${idx === activeThumbIndex ? 'active' : ''}`}
                        onClick={() => setActiveThumbIndex(idx)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    ))}
                  </div>

                  <div className="mainImageWrapper">
                    {/* FIX #2: STATUS_DISPLAY lookup */}
                    <div className={`mainImageBadge ${STATUS_DISPLAY[currentProduct.status]?.cls}`}>
                      {STATUS_DISPLAY[currentProduct.status]?.text}
                    </div>
                    <div className="mainImageContainer">
                      <svg className="placeholder-img-icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action and Download Row */}
              <div className="galleryActions">
                <button
                  className="downloadBtn"
                  onClick={() => showToast(`Đã tải xuống ảnh máy ${currentProduct.name} thành công!`)}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  TẢI XUỐNG
                </button>
                <div className="detailPrice">{formatMoneyRaw(currentProduct.price)}</div>
              </div>

              {/* Condition progress bar & actions */}
              <div className="detailBottom">
                <div className="conditionWrapper">
                  <div className="conditionLabel">
                    <span>Tình trạng:</span>
                    <strong>{currentProduct.condition}%</strong>
                  </div>
                  <div className="progressBarContainer">
                    <div className="progressBar" style={{ width: `${currentProduct.condition}%` }}></div>
                  </div>
                  <div className="descWrapper">
                    <strong>Mô tả ngắn:</strong>
                    <p>{currentProduct.description}</p>
                  </div>
                </div>

                <div className="actionsWrapper">
                  {/* FIX #2: PRODUCT_STATUS constants replace magic strings */}
                  {currentProduct.status === PRODUCT_STATUS.IN_STOCK ? (
                    <>
                      <button className="actionBtn btnBan" onClick={() => setSellModalOpen(true)}>
                        BÁN NGAY
                      </button>
                      <button className="actionBtn btnCoc" onClick={() => setDepositModalOpen(true)}>
                        NHẬN CỌC
                      </button>
                    </>
                  ) : currentProduct.status === PRODUCT_STATUS.DEPOSITED ? (
                    <>
                      <button className="actionBtn btnBan" onClick={() => setSellModalOpen(true)}>
                        BÁN NGAY
                      </button>
                      <button className="actionBtn btnRelease" onClick={handleReleaseProduct}>
                        HỦY CỌC (CÒN HÀNG)
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="statusNotice">Sản phẩm này đã được bán thành công.</p>
                      <button className="actionBtn btnRelease" onClick={handleReleaseProduct}>
                        RESET CÒN HÀNG
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SUBVIEW: NHẬP LIỆU ── */}
      {currentTab === 'nhap-lieu' && (
        <div id="nhap-lieu-view">
          <div className="viewHeader">
            <h2>NHẬP KHO MÁY CŨ MỚI</h2>
            <p className="viewSubtitle">Điền đầy đủ thông tin để nhập kho sản phẩm cũ vào bảng giá hệ thống.</p>
          </div>

          <form onSubmit={handleAddProduct} className="entryForm">
            <div className="formGrid">
              <div className="formGroup">
                <label htmlFor="f-brand">Thương hiệu *</label>
                <select id="f-brand" value={fBrand} onChange={(e) => setFBrand(e.target.value)}>
                  {Object.keys(BRAND_SLOGANS).map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="formGroup">
                <label htmlFor="f-name">Tên model *</label>
                <input
                  type="text"
                  id="f-name"
                  placeholder="Ví dụ: X-M5, EOS R6 II..."
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="f-color">Màu sắc *</label>
                <div className="colorInputWrapper">
                  <input
                    type="color"
                    id="f-color"
                    value={fColor}
                    onChange={(e) => setFColor(e.target.value)}
                  />
                  <input
                    type="text"
                    id="f-color-text"
                    value={fColor}
                    onChange={(e) => setFColor(e.target.value)}
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="formGroup">
                <label htmlFor="f-price">Giá bán (VNĐ) *</label>
                <input
                  type="number"
                  id="f-price"
                  placeholder="Ví dụ: 21990000"
                  value={fPrice}
                  onChange={(e) => setFPrice(e.target.value)}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="f-serial">Mã Serial *</label>
                <input
                  type="text"
                  id="f-serial"
                  placeholder="Ví dụ: 37428"
                  value={fSerial}
                  onChange={(e) => setFSerial(e.target.value)}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="f-shot">Số shot chụp *</label>
                <input
                  type="text"
                  id="f-shot"
                  placeholder="Ví dụ: 5.000, 15.000..."
                  value={fShot}
                  onChange={(e) => setFShot(e.target.value)}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="f-location">Vị trí kho máy *</label>
                <select id="f-location" value={fLocation} onChange={(e) => setFLocation(e.target.value)}>
                  {LOCATIONS.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="formGroup">
                <label htmlFor="f-staff">Nhân viên phụ trách nhập *</label>
                <select id="f-staff" value={fStaff} onChange={(e) => setFStaff(e.target.value)}>
                  {STAFFS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="formGroup">
                <label htmlFor="f-condition">Tình trạng máy (%) *</label>
                <input
                  type="number"
                  id="f-condition"
                  min="1"
                  max="100"
                  value={fCondition}
                  onChange={(e) => setFCondition(parseInt(e.target.value, 10))}
                  required
                />
              </div>

              <div className="formGroup checkboxGroup">
                <label>
                  <input
                    type="checkbox"
                    id="f-box"
                    checked={fBox}
                    onChange={(e) => setFBox(e.target.checked)}
                  />{' '}
                  Máy kèm Hộp (Fullbox)
                </label>
                <label>
                  <input
                    type="checkbox"
                    id="f-lens"
                    checked={fLens}
                    onChange={(e) => setFLens(e.target.checked)}
                  />{' '}
                  Máy đi kèm Ống kính (Lens Kit)
                </label>
              </div>
            </div>

            <div className="formGroup fullWidth">
              <label htmlFor="f-accessories">Danh sách phụ kiện kèm theo *</label>
              <input
                type="text"
                id="f-accessories"
                placeholder="Ví dụ: Sạc, Pin, Dây đeo, Thẻ nhớ..."
                value={fAccessories}
                onChange={(e) => setFAccessories(e.target.value)}
                required
              />
            </div>

            <div className="formGroup fullWidth">
              <label htmlFor="f-desc">Mô tả ngắn tình trạng ngoại hình *</label>
              <textarea
                id="f-desc"
                rows="3"
                placeholder="Ví dụ: Ngoại hình trầy nhẹ góc, báng cầm hơi ố, thấu kính sạch..."
                value={fDesc}
                onChange={(e) => setFDesc(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="submitBtn">LƯU SẢN PHẨM</button>
          </form>

          {/* Backup Database */}
          <div className="backupRestoreSection">
            <h3>SAO LƯU & ĐỒNG BỘ DỮ LIỆU</h3>
            <p className="backupText">
              Vì hệ thống vận hành hoàn toàn phía máy khách (Client-side), bạn có thể xuất cơ sở dữ liệu làm file JSON để gửi cho nhân viên chi nhánh khác, hoặc nhập file JSON nhận được để cập nhật bảng giá.
            </p>
            <div className="backupActions">
              <button type="button" className="backupBtn btnExport" onClick={handleExportDB}>
                XUẤT DỮ LIỆU JSON
              </button>
              {/* FIX #8: useRef instead of document.getElementById */}
              <button
                type="button"
                className="backupBtn btnImport"
                onClick={() => importFileRef.current?.click()}
              >
                NHẬP DỮ LIỆU JSON
              </button>
              <input
                ref={importFileRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleImportDB}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── SUBVIEW: LỊCH SỬ GIAO DỊCH ── */}
      {currentTab === 'lich-su' && (
        <div id="lich-su-view">
          <div className="viewHeader">
            <h2>LỊCH SỬ GIAO DỊCH NỘI BỘ</h2>
            <p className="viewSubtitle">Theo dõi toàn bộ các hoạt động nhập kho, bán hàng và nhận cọc tại các chi nhánh.</p>
          </div>

          <div className="historyTimeline">
            {history.length === 0 ? (
              <p className="noHistory">Chưa có hoạt động giao dịch nào được ghi nhận.</p>
            ) : (
              history.map(log => {
                // FIX #2: LOG_DISPLAY lookup replaces repeated if-else chains
                const { text: typeText, cls: typeClass } = LOG_DISPLAY[log.type] ?? LOG_DISPLAY[LOG_TYPE.SYSTEM];

                return (
                  <div key={log.id} className="historyItem">
                    <div className="historyMeta">
                      <span className={`historyType ${typeClass}`}>{typeText}</span>
                      <span className="historyTime">{formatDate(log.date)}</span>
                    </div>
                    <div className="historyContent">
                      <p className="historyDetails">{log.details}</p>
                      <div className="historyFooter">
                        <span><strong>Người thực hiện:</strong> {log.staff}</span>
                        <span className="dot-separator">•</span>
                        <span><strong>Chi nhánh:</strong> {log.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
         MODALS (DEPOSIT & SELL)
         ════════════════════════════════════════════════════ */}

      {/* DEPOSIT MODAL */}
      {depositModalOpen && currentProduct && (
        <div className="modalOverlay" id="deposit-modal">
          <div className="modalBox">
            <button className="modalCloseBtn" onClick={() => setDepositModalOpen(false)}>
              ✕
            </button>

            <div className="modalProductCard">
              <div className="modalProductImg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div className="modalProductInfo">
                <h4>{currentProduct.name}</h4>
                <p>
                  {currentProduct.specs.split(' / ')[0]} / {currentProduct.serial}
                </p>
                <div className="modalProductPrice">{formatMoney(currentProduct.price)}</div>
              </div>
            </div>

            <form onSubmit={handleConfirmDeposit}>
              <div className="modalFormFields">
                <div className="modalFieldGroup">
                  <label htmlFor="m-dep-staff">Khách cọc của</label>
                  <select
                    id="m-dep-staff"
                    value={mDepStaff}
                    onChange={(e) => setMDepStaff(e.target.value)}
                    required
                  >
                    {STAFFS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="modalFieldGroup">
                  <select
                    id="m-dep-location"
                    value={mDepLocation}
                    onChange={(e) => setMDepLocation(e.target.value)}
                    required
                  >
                    {LOCATIONS.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="modalSubmitBtn btnCoc">
                XÁC NHẬN CỌC MÁY
              </button>
            </form>

            <p className="modalDisclaimer">
              * Lưu ý: Thời hạn cọc hệ thống không quá 1 tuần, sau thời gian này hệ thống sẽ tự reset về tình trạng còn hàng.
            </p>
          </div>
        </div>
      )}

      {/* SELL MODAL */}
      {sellModalOpen && currentProduct && (
        <div className="modalOverlay" id="sell-modal">
          <div className="modalBox">
            <button className="modalCloseBtn" onClick={() => setSellModalOpen(false)}>
              ✕
            </button>

            <div className="modalProductCard">
              <div className="modalProductImg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div className="modalProductInfo">
                <h4>{currentProduct.name}</h4>
                <p>
                  {currentProduct.specs.split(' / ')[0]} / {currentProduct.serial}
                </p>
                <div className="modalProductPrice">{formatMoney(currentProduct.price)}</div>
              </div>
            </div>

            <form onSubmit={handleConfirmSell}>
              <div className="modalFormFields">
                <div className="modalFieldGroup">
                  <label htmlFor="m-sell-staff">Tên người bán</label>
                  <select
                    id="m-sell-staff"
                    value={mSellStaff}
                    onChange={(e) => setMSellStaff(e.target.value)}
                    required
                  >
                    {STAFFS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="modalFieldGroup">
                  <select
                    id="m-sell-location"
                    value={mSellLocation}
                    onChange={(e) => setMSellLocation(e.target.value)}
                    required
                  >
                    {LOCATIONS.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="modalSubmitBtn btnBan">
                XÁC NHẬN ĐÃ BÁN
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
