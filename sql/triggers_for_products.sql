create function update_audit_time_products() 
returns trigger as $$
begin
	if row(new.*) is distinct from row(old.*) then 
		new.update_audit_time := now();
	end if ;
return new;
end;
$$ language plpgsql;
create trigger update_audit_time_products_trigger
before update on products 
for each row execute function update_audit_time_products();