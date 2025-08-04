global class AddressCheck {
webservice static String getAddresses (String postcode) {
System.debug('AddressCheck input: ' + postcode);

String postcodeCondition = (postcode == '') ? '' : 'postcode__c like \'%' + postcode + '%\'';
String conditions = '';
conditions += (conditions != '' && postcodeCondition != '') ? ' and ' : '';
conditions += postcodeCondition;
String whereConditions = (conditions == '') ? '' : ' where ' + conditions;
String query = 'select id, site_id__c, postcode__c, address_1__c, address_2__c, description__c from TestAddress__c ' + whereConditions;
List<TestAddress__c> sl = Database.query(query);

String result = JSON.serialize(sl);
System.debug('AddressCheck output: ' + result);

return result;
}
}