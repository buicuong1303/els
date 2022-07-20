--skill
INSERT INTO skill (name)
VALUES('writing');
INSERT INTO skill (name)
VALUES('listening');
INSERT INTO skill (name)
VALUES('speaking');
INSERT INTO skill (name)
VALUES('reading');

--level
INSERT INTO "level" (level)
VALUES(1);
INSERT INTO "level" (level)
VALUES(2);
INSERT INTO "level" (level)
VALUES(3);
INSERT INTO "level" (level)
VALUES(4);
INSERT INTO "level" (level)
VALUES(5);
INSERT INTO "level" (level)
VALUES(6);
INSERT INTO "level" (level)
VALUES(7);
INSERT INTO "level" (level)
VALUES(8);
INSERT INTO "level" (level)
VALUES(9);


--skill-level
insert into skill_level (alpha, "skillId", "levelId")
values (0.4, (select id from skill where skill.name = 'reading'), (select id from "level" where "level"."level" = 1) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.65, (select id from skill where skill.name = 'reading'), (select id from "level" where "level"."level" = 2) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.8, (select id from skill where skill.name = 'reading'), (select id from "level" where "level"."level" = 3) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.9, (select id from skill where skill.name = 'reading'), (select id from "level" where "level"."level" = 4) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.93, (select id from skill where skill.name = 'reading'), (select id from "level" where "level"."level" = 5) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.95, (select id from skill where skill.name = 'reading'), (select id from "level" where "level"."level" = 6) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.97, (select id from skill where skill.name = 'reading'), (select id from "level" where "level"."level" = 7) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.98, (select id from skill where skill.name = 'reading'), (select id from "level" where "level"."level" = 8) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.99, (select id from skill where skill.name = 'reading'), (select id from "level" where "level"."level" = 9) );

insert into skill_level (alpha, "skillId", "levelId")
values (0.4, (select id from skill where skill.name = 'listening'), (select id from "level" where "level"."level" = 1) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.65, (select id from skill where skill.name = 'listening'), (select id from "level" where "level"."level" = 2) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.8, (select id from skill where skill.name = 'listening'), (select id from "level" where "level"."level" = 3) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.9, (select id from skill where skill.name = 'listening'), (select id from "level" where "level"."level" = 4) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.93, (select id from skill where skill.name = 'listening'), (select id from "level" where "level"."level" = 5) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.95, (select id from skill where skill.name = 'listening'), (select id from "level" where "level"."level" = 6) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.97, (select id from skill where skill.name = 'listening'), (select id from "level" where "level"."level" = 7) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.98, (select id from skill where skill.name = 'listening'), (select id from "level" where "level"."level" = 8) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.99, (select id from skill where skill.name = 'listening'), (select id from "level" where "level"."level" = 9) );

insert into skill_level (alpha, "skillId", "levelId")
values (0.4, (select id from skill where skill.name = 'speaking'), (select id from "level" where "level"."level" = 1) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.65, (select id from skill where skill.name = 'speaking'), (select id from "level" where "level"."level" = 2) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.8, (select id from skill where skill.name = 'speaking'), (select id from "level" where "level"."level" = 3) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.9, (select id from skill where skill.name = 'speaking'), (select id from "level" where "level"."level" = 4) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.93, (select id from skill where skill.name = 'speaking'), (select id from "level" where "level"."level" = 5) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.95, (select id from skill where skill.name = 'speaking'), (select id from "level" where "level"."level" = 6) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.97, (select id from skill where skill.name = 'speaking'), (select id from "level" where "level"."level" = 7) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.98, (select id from skill where skill.name = 'speaking'), (select id from "level" where "level"."level" = 8) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.99, (select id from skill where skill.name = 'speaking'), (select id from "level" where "level"."level" = 9) );

insert into skill_level (alpha, "skillId", "levelId")
values (0.4, (select id from skill where skill.name = 'writing'), (select id from "level" where "level"."level" = 1) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.65, (select id from skill where skill.name = 'writing'), (select id from "level" where "level"."level" = 2) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.8, (select id from skill where skill.name = 'writing'), (select id from "level" where "level"."level" = 3) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.9, (select id from skill where skill.name = 'writing'), (select id from "level" where "level"."level" = 4) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.93, (select id from skill where skill.name = 'writing'), (select id from "level" where "level"."level" = 5) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.95, (select id from skill where skill.name = 'writing'), (select id from "level" where "level"."level" = 6) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.97, (select id from skill where skill.name = 'writing'), (select id from "level" where "level"."level" = 7) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.98, (select id from skill where skill.name = 'writing'), (select id from "level" where "level"."level" = 8) );
insert into skill_level (alpha, "skillId", "levelId")
values (0.99, (select id from skill where skill.name = 'writing'), (select id from "level" where "level"."level" = 9) );


--categgory
insert into category (name)
values ('Học sinh');
insert into category (name)
values ('Giao tiếp thông dụng');
insert into category (name)
values ('Chuyên ngành');
insert into category (name)
values ('Từ loại khác');

--spec
insert into specialization (name, "categoryId")
values ('Gia đình', (select id from category where category.name = 'Giao tiếp thông dụng'));
insert into specialization (name, "categoryId")
values ('Con người', (select id from category where category.name = 'Giao tiếp thông dụng'));
insert into specialization (name, "categoryId")
values ('Giáo dục, đào tạo', (select id from category where category.name = 'Giao tiếp thông dụng'));
insert into specialization (name, "categoryId")
values ('Đồ dùng, vật dụng', (select id from category where category.name = 'Giao tiếp thông dụng'));
insert into specialization (name, "categoryId")
values ('Nghề nghiệp, văn phòng', (select id from category where category.name = 'Giao tiếp thông dụng'));
insert into specialization (name, "categoryId")
values ('Nhà cửa, nội thất', (select id from category where category.name = 'Giao tiếp thông dụng'));
insert into specialization (name, "categoryId")
values ('Ẩm thực', (select id from category where category.name = 'Giao tiếp thông dụng'));
insert into specialization (name, "categoryId")
values ('Nghệ thuật', (select id from category where category.name = 'Giao tiếp thông dụng'));
insert into specialization (name, "categoryId")
values ('Thể thao', (select id from category where category.name = 'Giao tiếp thông dụng'));
insert into specialization (name, "categoryId")
values ('Khí hậu, đất và nước', (select id from category where category.name = 'Giao tiếp thông dụng'));
insert into specialization (name, "categoryId")
values ('Trang phục, thời trang', (select id from category where category.name = 'Giao tiếp thông dụng'));
insert into specialization (name, "categoryId")
values ('Giao thông, di chuyển', (select id from category where category.name = 'Giao tiếp thông dụng'));
insert into specialization (name, "categoryId")
values ('Động vật, thực vật', (select id from category where category.name = 'Giao tiếp thông dụng'));
insert into specialization (name, "categoryId")
values ('Du lịch, nhà hàng', (select id from category where category.name = 'Giao tiếp thông dụng'));
insert into specialization (name, "categoryId")
values ('Y tế, sức khỏe', (select id from category where category.name = 'Giao tiếp thông dụng'));
insert into specialization (name, "categoryId")
values ('Cơ quan, tổ chức', (select id from category where category.name = 'Giao tiếp thông dụng'));



--reward unit
insert into reward_unit (name, code)
values ('experience', 'exp');
insert into reward_unit (name, code)
values ('coin', 'coin');

--reward
insert into reward (value, "rewardUnitId")
values (500, ( select id from reward_unit where reward_unit.code ='exp'));
insert into reward (value, "rewardUnitId")
values (1000, ( select id from reward_unit where reward_unit.code ='exp'));
insert into reward (value, "rewardUnitId")
values (1500, ( select id from reward_unit where reward_unit.code ='exp'));


--mision
insert into mission (title , code , "maxProgress", "repeatable", "mode", "type","durationHours", "rewardId")
values ('Điểm danh hằng ngày', 'check_in', 1, 'daily', 'auto', 'system', 24, (select id from reward where reward.value=1000));

insert into mission (title , code , "maxProgress", "repeatable", "mode", "type","durationHours", "rewardId")
values ('Ôn tập từ đã quên', 'review_forgot', 5, 'daily', 'auto', 'optional',24 , (select id from reward where reward.value = 1000));
insert into mission (title , code , "maxProgress", "repeatable", "mode", "type","durationHours", "rewardId")
values ('Ôn tập từ sắp quên', 'review_vague', 5, 'daily', 'auto', 'optional', 24, (select id from reward where reward.value = 1000));
insert into mission (title , code , "maxProgress", "repeatable", "mode", "type","durationHours", "rewardId")
values ('Học từ mới', 'learn_new', 5, 'daily', 'auto', 'optional', 24, (select id from reward where reward.value = 1000));

insert into mission (title , code , "maxProgress", "repeatable", "mode", "type", "durationHours", "rewardId")
values ('Hoàn thành 1 chủ đề', 'complete_1_topic', 1, 'none', 'auto', 'system', -1, (select id from reward where reward.value = 1000));
insert into mission (title , code , "maxProgress", "repeatable", "mode", "type", "durationHours", "rewardId")
values ('Hoàn thành 2 chủ đề', 'complete_2_topics', 2, 'none', 'auto', 'system', -1, (select id from reward where reward.value = 1000));
insert into mission (title , code , "maxProgress", "repeatable", "mode", "type", "durationHours", "rewardId")
values ('Đạt chuỗi 5 ngày streak', 'streaks_5', 5, 'none', 'auto', 'system', -1, (select id from reward where reward.value = 1000));
insert into mission (title , code , "maxProgress", "repeatable", "mode", "type", "durationHours", "rewardId")
values ('Đạt chuỗi 3 ngày streak', 'streaks_3', 3, 'none', 'auto', 'system', -1, (select id from reward where reward.value = 1000));
insert into mission (title , code , "maxProgress", "repeatable", "mode", "type", "durationHours", "rewardId")
values ('Đạt level 10', 'obtain_level_10', 10, 'none', 'auto', 'system', -1, (select id from reward where reward.value = 1000));
insert into mission (title , code , "maxProgress", "repeatable", "mode", "type", "durationHours", "rewardId")
values ('Đạt #1 trong trong bảng xếp hạng bất kỳ', 'top_1', 1, 'none', 'auto', 'system', -1, (select id from reward where reward.value = 1000));
insert into mission (title , code , "maxProgress", "repeatable", "mode", "type", "durationHours", "rewardId")
values ('Mời 5 người cùng tham gia', 'invite_5_persons', 5, 'none', 'auto', 'system', -1, (select id from reward where reward.value = 1000));

--language
insert into base_lang (name , code)
values ('english', 'en');
insert into base_lang (name , code)
values ('vietnamese', 'vi');

--entity_type
INSERT INTO entity_type (code, entity)
VALUES('review-request', 'topic');
INSERT INTO entity_type (code, entity)
VALUES('welcome', 'user');
INSERT INTO entity_type (code, entity)
VALUES('congratulate-completing', 'topic');

/*Table rank_type*/
INSERT INTO public.rank_type
(name)
VALUES('Level');

INSERT INTO public.rank_type
(name)
VALUES('Word');

INSERT INTO public.rank_type
(name)
VALUES('Topics');

/*Table pos*/
INSERT INTO public.pos
("name", description)
VALUES('verb', 'động từ');

INSERT INTO public.pos
("name", description)
VALUES('noun', 'danh từ');

INSERT INTO public.pos
("name", description)
VALUES('adverb', 'trạng từ');

INSERT INTO public.pos
("name", description)
VALUES('adjective', 'tính từ');

INSERT INTO public.pos
("name", description)
VALUES('null', 'giá trị null');




