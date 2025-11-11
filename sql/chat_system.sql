create table chats (
id bigserial primary key,
product_id bigint not null references products(id) on delete cascade,
buyer_id bigint not null references users(id) on delete cascade,
seller_id bigint not null references users(id) on delete cascade,
msg text not null,
create_audit_time timestamptz not null default now(),
update_audit_time timestamptz
)
create function uat_chats()
returns trigger as $$
begin
	if row(new.*) is distinct from row(old.*) then
		new.update_audit_time := now();
	end if;
return new;
end;
$$ language plpgsql;
create trigger uat_trigger_chats before update on chats for each row execute function uat_chats();
alter table chats add constraint uq_chat unique (product_id, seller_id, buyer_id);
alter table chats drop column msg;
create table messages (
id bigserial primary key,
chat_id bigint references chats(id),
msg text not null,
sent_at timestamptz default now(),
update_at timestamptz
);
create function uat_messages() returns trigger as $$
begin 
if row(new.*) is distinct from row(old.*) then 
new.update_at := now();
end if;
return new;
end;
$$ language plpgsql;
create trigger uat_msg_trigger before update on messages
for each row execute function uat_messages();
insert into chats (product_id, seller_id, buyer_id) values ('4','1','8') on conflict (product_id, seller_id, buyer_id) do nothing returning id;/* Important for API's */
truncate table messages;
alter table messages add column sender_id bigint not null references users(id), add column reciever_id bigint not null references users(id) ;
insert into messages(chat_id, sender_id, reciever_id, msg) values('1','4','8','Is it still available');
