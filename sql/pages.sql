-- create table permissions (id bigserial primary key, role_id int references(role.id), page_id int references(pages.id);)
create table pages (id bigserial primary key, page varchar(20) not null unique);
insert into pages(page) values ('dashboard'),('moderator'),('products'),('create'),('manage'),('chat');
select * from pages;