create table categories (
id bigserial primary key,
category varchar(20)
);

create table conditions (
id bigserial primary key,
condition_name varchar(20)
);


create table products(
id bigserial primary key,
product_name varchar(50) not null unique,
img text not null unique,
category_id bigint not null references categories(id),
condition_id bigint not null references conditions(id),
description text,
price double precision not null,
create_audit_id bigint references users(id) not null,
create_audit_time timestamptz not null default now(),
update_audit_id bigint references users(id) not null,
update_audit_time timestamptz,
delete_audit_id bigint references users(id) not null,
delete_audit_time timestamptz
);