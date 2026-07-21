-- ============================================================
--  EquipLink – Seed Data Script
--  Run this AFTER the Spring Boot backend has started and
--  Hibernate has auto-created all tables via ddl-auto: update
-- ============================================================

-- ============================================================
--  1. CATEGORIES – All Heavy Equipment Fleet Types
-- ============================================================
INSERT INTO categories (name, description, created_at, updated_at)
VALUES
  -- Earthmoving & Excavation
  ('Excavators',           'Hydraulic track and wheel excavators for digging, trenching, and demolition.',                     NOW(), NOW()),
  ('Bulldozers',           'Powerful crawler tractors with front blades for pushing earth, rock, and debris.',                 NOW(), NOW()),
  ('Motor Graders',        'Road construction graders for leveling, grading, and fine surface finishing.',                     NOW(), NOW()),
  ('Wheel Loaders',        'Front-end wheel loaders for loading, carrying, and dumping bulk materials.',                       NOW(), NOW()),
  ('Skid Steer Loaders',   'Compact, maneuverable skid steer loaders for tight construction sites.',                           NOW(), NOW()),
  ('Backhoe Loaders',      'Versatile backhoe loaders combining digging arm and front bucket capabilities.',                   NOW(), NOW()),
  ('Trenchers',            'Chain and wheel trenchers for digging utility and irrigation trenches.',                            NOW(), NOW()),
  ('Scrapers',             'Motorized scrapers for large-scale earthmoving and cut-and-fill operations.',                       NOW(), NOW()),

  -- Lifting & Hoisting
  ('Mobile Cranes',        'All-terrain and rough-terrain mobile cranes for heavy lifting on construction sites.',              NOW(), NOW()),
  ('Tower Cranes',         'Tall tower cranes for high-rise building construction and heavy material hoisting.',                NOW(), NOW()),
  ('Crawler Cranes',       'Track-mounted crawler cranes for lifting in soft or uneven ground conditions.',                    NOW(), NOW()),
  ('Telescopic Handlers',  'Telehandlers with extendable boom for lifting and placing materials at height.',                   NOW(), NOW()),
  ('Aerial Work Platforms','Scissor lifts, boom lifts, and cherry pickers for safe elevated access.',                          NOW(), NOW()),
  ('Forklifts',            'Industrial forklifts for warehouse, logistics, and site material handling.',                       NOW(), NOW()),

  -- Compaction & Paving
  ('Compactors',           'Vibratory plate compactors, rollers, and rammers for soil and asphalt compaction.',               NOW(), NOW()),
  ('Asphalt Pavers',       'Self-propelled asphalt pavers and finishers for road surface laying.',                             NOW(), NOW()),
  ('Road Rollers',         'Single drum, tandem, and pneumatic tire rollers for road compaction.',                             NOW(), NOW()),
  ('Cold Planers',         'Milling machines for cold planing asphalt road surfaces before repaving.',                        NOW(), NOW()),

  -- Drilling & Piling
  ('Piling Rigs',          'Hydraulic piling rigs for driven and bored pile foundation installation.',                        NOW(), NOW()),
  ('Rock Drills',          'Top-hammer and down-the-hole rock drills for quarrying and tunneling.',                           NOW(), NOW()),
  ('Water Well Drills',    'Rotary and cable-tool rigs for water well drilling and soil investigation.',                       NOW(), NOW()),

  -- Concrete & Masonry
  ('Concrete Pumps',       'Truck-mounted and stationary concrete pumps for high-rise and large-pour placements.',            NOW(), NOW()),
  ('Transit Mixers',       'Drum-mounted rotating concrete mixers for on-site and ready-mix delivery.',                       NOW(), NOW()),
  ('Concrete Batching Plants', 'Mobile and stationary batching plants for producing fresh concrete on-site.',                 NOW(), NOW()),
  ('Concrete Breakers',    'Hydraulic and pneumatic breakers and demolition hammers for concrete breaking.',                  NOW(), NOW()),

  -- Transport & Haulage
  ('Dump Trucks',          'Rigid and articulated dump trucks for off-road earthmoving and quarry haulage.',                  NOW(), NOW()),
  ('Articulated Haulers',  'Flexible-chassis articulated dump trucks designed for soft and rough terrain.',                   NOW(), NOW()),
  ('Lowboy Trailers',      'Low-bed semi-trailers for transporting heavy machinery and over-dimensional loads.',               NOW(), NOW()),
  ('Flatbed Trucks',       'Platform flatbed trucks for transporting steel, pipes, and construction materials.',               NOW(), NOW()),
  ('Tanker Trucks',        'Liquid tankers for water, fuel, and chemical transport on construction sites.',                    NOW(), NOW()),

  -- Mining & Quarrying
  ('Mining Loaders',       'Underground and surface mining loaders for ore and rock extraction.',                             NOW(), NOW()),
  ('Surface Miners',       'Continuous surface mining machines for selective extraction without blasting.',                    NOW(), NOW()),
  ('Draglines',            'Large excavation machines using a dragging bucket system for surface mining.',                    NOW(), NOW()),

  -- Forestry & Agricultural
  ('Forestry Mulchers',    'Drum and disc mulchers for land clearing, brush, and tree removal.',                              NOW(), NOW()),
  ('Timber Harvesters',    'Self-propelled harvesters for felling, delimbing, and bucking timber.',                           NOW(), NOW()),
  ('Stump Grinders',       'Compact and self-propelled stump grinders for removing tree root systems.',                       NOW(), NOW()),

  -- Utility & Special Purpose
  ('Vacuum Excavators',    'Hydro-vacuum excavators for safe digging near utilities and sensitive areas.',                    NOW(), NOW()),
  ('Road Sweepers',        'Mechanical and regenerative air road sweepers for highway and site cleaning.',                    NOW(), NOW()),
  ('Water Tankers',        'On-site water tankers for dust suppression and construction water supply.',                       NOW(), NOW()),
  ('Light Towers',         'Mobile diesel and solar light towers for night construction and emergency lighting.',              NOW(), NOW()),
  ('Generators',           'Diesel, gas, and hybrid generators for on-site and remote power supply.',                        NOW(), NOW()),
  ('Air Compressors',      'Portable and stationary air compressors for pneumatic tool powering.',                            NOW(), NOW()),
  ('Welding Machines',     'Industrial MIG, TIG, and arc welding machines for structural fabrication.',                       NOW(), NOW()),

  -- Marine & Dredging
  ('Dredgers',             'Cutter suction and trailing suction dredgers for waterway and port deepening.',                   NOW(), NOW()),
  ('Barges',               'Flat-bottomed cargo barges for waterway transport of heavy materials and machinery.',              NOW(), NOW()),
  ('Marine Cranes',        'Offshore and harbor cranes for heavy lifting in port and marine environments.',                   NOW(), NOW())

ON CONFLICT DO NOTHING;

-- ============================================================
--  Verify Category Count
-- ============================================================
SELECT COUNT(*) AS total_categories FROM categories;
