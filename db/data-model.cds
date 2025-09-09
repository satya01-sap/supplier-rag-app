namespace com.sst;

using { cuid, managed } from '@sap/cds/common';

entity SuppliersEmbedding : managed, cuid {
       supplierText : String;
       supplierMetadata : LargeString; 
       supplierRating: Decimal(3, 2);
       supplierEmbedding: Vector(3072);
}




