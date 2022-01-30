const { get } = require('../../config/pgsql');


async function post_orgs(req, res) {
	let org_map = new Map();
	await create_orgs(req.body, org_map);

	res.status(200).end();
}

async function create_orgs(org, org_map, parent_org_id) {
	let self_org_id = org_map.get(org.org_name);

	if (!self_org_id) {
		let oSql =
			`INSERT INTO organization(org_name) VALUES ('${org.org_name}') ON CONFLICT (org_name) DO UPDATE set self_org_id = lastval() RETURNING self_org_id`;

		let res_o = await get(oSql);

		self_org_id = res_o[0].self_org_id;
		org_map.set(org.org_name, self_org_id);
	}

	if (self_org_id && parent_org_id > 0) {
		let orSql = `INSERT INTO organization_relation (self_org_id, parent_org_id) VALUES ('${self_org_id}', '${parent_org_id}') ON CONFLICT (self_org_id, parent_org_id) DO UPDATE set self_org_id = '${self_org_id}', parent_org_id = '${parent_org_id}'`;

		let res = await get(orSql);
	}

	while (org.daughters && org.daughters.length) {
		await create_orgs(org.daughters.shift(), org_map, self_org_id);
	}
}

async function get_orgs(req, res) {
	let org_name = req.params.organization_name;
	let offset = parseInt(req.query.page) < 2 ? 0 : (parseInt(req.query.page) - 1) * 100;

	let oSql = `
		SELECT 
			'parent' as relationship_type,
			organization.org_name as org_name
		FROM organization_relation
		JOIN organization ON organization_relation.parent_org_id = organization.self_org_id
		WHERE organization_relation.self_org_id = (
			SELECT self_org_id FROM organization WHERE org_name= '${org_name}')
		UNION
		SELECT 
			'daughter' as relationship_type,
			organization.org_name as org_name 
		FROM organization_relation
		JOIN organization ON organization_relation.self_org_id = organization.self_org_id
		WHERE 
			organization_relation.parent_org_id = (
				SELECT self_org_id FROM organization WHERE org_name= '${org_name}')
		UNION
		SELECT 
			'sister' as relationship_type,
			organization.org_name as org_name
		FROM organization_relation AS or1
		JOIN organization_relation AS or2 ON or1.parent_org_id = or2.parent_org_id
		JOIN organization ON or2.self_org_id = organization.self_org_id
		WHERE or1.self_org_id = 
			(SELECT self_org_id FROM organization WHERE org_name= '${org_name}') AND organization.org_name <> '${org_name}'
		ORDER BY org_name ASC
		LIMIT 100 OFFSET ${offset}`;

	let res_o = await get(oSql);

	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(res_o));
}

module.exports = {
	post_orgs,
	get_orgs,
};
