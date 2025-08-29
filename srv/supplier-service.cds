using { com.sst as db } from '../db/data-model';

service SupplierServcie  @(requires: 'authenticated-user') {

    entity Suppliers as projection on db.SuppliersEmbedding excluding { supplierEmbedding };

    function storeEmbeddings() returns String(2);

    function ListSuppliers() returns array of String;

    //function getSuppliersList() returns array of String;

    function findSuppliers(query: String(500)) returns array of String;


    

    

}
