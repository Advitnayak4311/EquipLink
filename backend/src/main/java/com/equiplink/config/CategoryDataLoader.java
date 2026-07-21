package com.equiplink.config;

import com.equiplink.entity.Category;
import com.equiplink.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Startup runner to pre-populate all heavy equipment fleet categories in the database.
 * Only runs once – skips seeding if categories already exist.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CategoryDataLoader implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            log.info("Categories already seeded. Skipping initialization.");
            return;
        }

        log.info("Seeding all heavy equipment fleet categories...");

        List<Category> categories = List.of(
            // ── Earthmoving & Excavation ──────────────────────────────────────────────
            category("Excavators",            "Hydraulic track and wheel excavators for digging, trenching, and demolition.",                   "excavator"),
            category("Bulldozers",            "Powerful crawler tractors with front blades for pushing earth, rock, and debris.",               "bulldozer"),
            category("Motor Graders",         "Road construction graders for leveling, grading, and fine surface finishing.",                   "grader"),
            category("Wheel Loaders",         "Front-end wheel loaders for loading, carrying, and dumping bulk materials.",                     "loader"),
            category("Skid Steer Loaders",    "Compact, maneuverable skid steer loaders ideal for tight construction sites.",                  "skid-steer"),
            category("Backhoe Loaders",       "Versatile backhoe loaders combining a digging arm and front bucket.",                           "backhoe"),
            category("Trenchers",             "Chain and wheel trenchers for digging utility and irrigation trenches.",                         "trencher"),
            category("Scrapers",              "Motorized scrapers for large-scale earthmoving and cut-and-fill operations.",                    "scraper"),
            category("Compactors",            "Vibratory plate compactors, rollers, and rammers for soil and asphalt compaction.",             "compactor"),

            // ── Lifting & Hoisting ────────────────────────────────────────────────────
            category("Mobile Cranes",         "All-terrain and rough-terrain cranes for heavy lifting on construction sites.",                  "crane"),
            category("Tower Cranes",          "Tall tower cranes for high-rise building construction and heavy material hoisting.",             "tower-crane"),
            category("Crawler Cranes",        "Track-mounted crawler cranes for lifting on soft or uneven ground.",                            "crawler-crane"),
            category("Telescopic Handlers",   "Telehandlers with extendable boom for placing materials at height.",                            "telehandler"),
            category("Aerial Work Platforms", "Scissor lifts, boom lifts, and cherry pickers for safe elevated access.",                       "aerial-lift"),
            category("Forklifts",             "Industrial forklifts for warehouse, logistics, and site material handling.",                     "forklift"),

            // ── Compaction & Paving ───────────────────────────────────────────────────
            category("Asphalt Pavers",        "Self-propelled asphalt pavers and finishers for road surface laying.",                          "paver"),
            category("Road Rollers",          "Single drum, tandem, and pneumatic tire rollers for road compaction.",                          "roller"),
            category("Cold Planers",          "Milling machines for cold planing asphalt surfaces before repaving.",                           "planer"),

            // ── Drilling & Piling ─────────────────────────────────────────────────────
            category("Piling Rigs",           "Hydraulic piling rigs for driven and bored pile foundation installation.",                      "piling"),
            category("Rock Drills",           "Top-hammer and down-the-hole rock drills for quarrying and tunneling.",                         "drill"),
            category("Water Well Drills",     "Rotary and cable-tool rigs for water well drilling and soil investigation.",                    "water-drill"),

            // ── Concrete & Masonry ────────────────────────────────────────────────────
            category("Concrete Pumps",        "Truck-mounted and stationary concrete pumps for large pour placements.",                        "pump"),
            category("Transit Mixers",        "Drum-mounted rotating concrete mixers for on-site and ready-mix delivery.",                     "mixer"),
            category("Concrete Batching Plants","Mobile and stationary batching plants for producing fresh concrete on-site.",                 "batching"),
            category("Concrete Breakers",     "Hydraulic and pneumatic breakers for concrete demolition and breaking.",                        "breaker"),

            // ── Transport & Haulage ───────────────────────────────────────────────────
            category("Dump Trucks",           "Rigid and articulated dump trucks for off-road earthmoving and quarry haulage.",               "dump-truck"),
            category("Articulated Haulers",   "Flexible-chassis dump trucks designed for soft and rough terrain.",                             "hauler"),
            category("Lowboy Trailers",       "Low-bed semi-trailers for transporting heavy machinery and over-dimensional loads.",            "lowboy"),
            category("Flatbed Trucks",        "Platform flatbed trucks for transporting steel, pipes, and construction materials.",            "flatbed"),
            category("Tanker Trucks",         "Liquid tankers for water, fuel, and chemical transport on construction sites.",                 "tanker"),

            // ── Mining & Quarrying ────────────────────────────────────────────────────
            category("Mining Loaders",        "Underground and surface mining loaders for ore and rock extraction.",                           "mining-loader"),
            category("Surface Miners",        "Continuous surface miners for selective extraction without blasting.",                          "surface-miner"),
            category("Draglines",             "Large excavation machines using a dragging bucket system for surface mining.",                  "dragline"),

            // ── Forestry & Land Clearing ──────────────────────────────────────────────
            category("Forestry Mulchers",     "Drum and disc mulchers for land clearing, brush, and tree removal.",                           "mulcher"),
            category("Timber Harvesters",     "Self-propelled harvesters for felling, delimbing, and bucking timber.",                        "harvester"),
            category("Stump Grinders",        "Compact and self-propelled stump grinders for removing tree root systems.",                    "stump-grinder"),

            // ── Utility & Special Purpose ─────────────────────────────────────────────
            category("Vacuum Excavators",     "Hydro-vacuum excavators for safe digging near utilities and sensitive areas.",                 "vacuum-ex"),
            category("Road Sweepers",         "Mechanical and regenerative air road sweepers for highway and site cleaning.",                  "sweeper"),
            category("Water Tankers",         "On-site water tankers for dust suppression and construction water supply.",                    "water-tank"),
            category("Light Towers",          "Mobile diesel and solar light towers for night construction and emergency lighting.",           "light-tower"),
            category("Generators",            "Diesel, gas, and hybrid generators for on-site and remote power supply.",                     "generator"),
            category("Air Compressors",       "Portable and stationary air compressors for pneumatic tool powering.",                        "compressor"),
            category("Welding Machines",      "Industrial MIG, TIG, and arc welding machines for structural fabrication.",                   "welder"),

            // ── Marine & Dredging ─────────────────────────────────────────────────────
            category("Dredgers",              "Cutter suction and trailing suction dredgers for waterway and port deepening.",               "dredger"),
            category("Barges",                "Flat-bottomed cargo barges for waterway transport of heavy materials and machinery.",          "barge"),
            category("Marine Cranes",         "Offshore and harbor cranes for heavy lifting in port and marine environments.",               "marine-crane")
        );

        categoryRepository.saveAll(categories);
        log.info("Successfully seeded {} heavy equipment categories.", categories.size());
    }

    private Category category(String name, String description, String icon) {
        return Category.builder()
                .name(name)
                .description(description)
                .icon(icon)
                .build();
    }
}
