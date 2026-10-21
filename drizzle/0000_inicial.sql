CREATE TABLE `estilos` (
	`sistema_id` text NOT NULL,
	`estilo` text NOT NULL,
	`base` text DEFAULT '{}' NOT NULL,
	`overrides` text DEFAULT '{}' NOT NULL,
	`atualizado_em` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	PRIMARY KEY(`sistema_id`, `estilo`),
	FOREIGN KEY (`sistema_id`) REFERENCES `sistemas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sistemas` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`slug` text NOT NULL,
	`criado_em` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`atualizado_em` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sistemas_slug_unique` ON `sistemas` (`slug`);