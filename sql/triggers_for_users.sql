create or replace function update_time_column_users()
returns trigger as $$
begin
	if row(new.*) is distinct from row(old.*) then 
		new.update_audit_time := now();
	end if;
	return new;
end;
$$ language plpgsql;

create trigger update_audit_time_users before update on users
for each row execute function update_time_column_users();

select * from users;
update users set first_name = 'Yaswanth' where id=1;
select * from users;

alter table users rename column created_audit_time to create_audit_time;