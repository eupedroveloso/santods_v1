CREATE TABLE `presets` (
	`id` text PRIMARY KEY NOT NULL,
	`estilo` text NOT NULL,
	`nome` text NOT NULL,
	`dados` text NOT NULL,
	`criado_em` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
