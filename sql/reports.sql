create table reports (
id bigserial primary key,
product_id bigint not null references products(id),
reason varchar(50) not null,
status bool default null,
create_audit_id bigint not null references users(id),
create_audit_time timestamptz not null default now()
)