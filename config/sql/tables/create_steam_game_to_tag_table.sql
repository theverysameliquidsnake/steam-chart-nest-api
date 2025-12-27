CREATE TABLE steam_game_to_tag (
    steam_game_id INTEGER NOT NULL,
    steam_tag_id INTEGER NOT NULL,
    CONSTRAINT pk_steam_game_to_tag PRIMARY KEY (steam_game_id, steam_tag_id),
    CONSTRAINT fk_steam_game FOREIGN KEY (steam_game_id) REFERENCES steam_game(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_tag FOREIGN KEY (steam_tag_id) REFERENCES steam_tag(id) ON DELETE CASCADE ON UPDATE CASCADE
);