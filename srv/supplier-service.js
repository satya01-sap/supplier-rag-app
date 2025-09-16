const cds = require('@sap/cds')
const { AzureOpenAiChatClient, AzureOpenAiEmbeddingClient } = require('@sap-ai-sdk/foundation-models')
const { Document } = require("langchain/document");
const { similaritySearchWithFilter } = require('../srv/healper/search-healper');


module.exports = function (srv) {


    srv.on('storeEmbeddings', async(req, res) => {
        console.log('start storeEmbeddings....')

        const { SuppliersEmbedding } = cds.entities('com.sst')

         const docs = [];
         let aSupplierData =  await fetchSuppliersList();

        for (const supplier of aSupplierData) {
            const { Supplier, SupplierName, Product, ProductText, City, Country, Email, Phone, Rating } = supplier;

            const content = `
                Supplier: ${Supplier}
                SupplierName : ${SupplierName}
                Rating: ${Rating}
                Address: ${City},${Country}
                City: ${City}
                Country: ${Country}
                Product: ${Product}
                ProductText: ${ProductText}
                Email: ${Email}
                Phone: ${Phone}
                Status:'Active'
            `.trim();

            const metadata = {
                Supplier: Supplier,
                SupplierName,
                Product : Product,
                ProductText: ProductText,
                City: City,
                Country: Country,
                Email: Email,
                Phone: Phone,
                Rating: Rating
            };

            docs.push(
                new Document({
                    pageContent: content,
                    metadata
                })
            );
        }

         //=========================================================================================
         // Initialize the embedding client and get the embedding 
         //=========================================================================================

            /* Inser your code here */

        //EDN   
        

        await DELETE.from(SuppliersEmbedding);

        await INSERT.into(SuppliersEmbedding).entries(embeddedDocs);

        return 'OK'
    })

    this.on('listSuppliers', async req => {
       
        const { mimeType, base64Image } = await getLogo() 

         const aSuppliers =  await fetchSuppliersList();

          for (const supplier of aSuppliers) {

            supplier.Logo = `data:${mimeType};base64,${base64Image}`
            supplier.Status= 'Active'


        }

        return aSuppliers;
        
    });

    srv.on('findSuppliers', async (req) => {
        const query = req.data.query; // e.g., "Find Li-ion battery suppliers from China"


        //====================================================================================
        // Block 1: Initialize the azure client
        //====================================================================================
        
         /* Inser your code here */

        //END 

        //====================================================================================
        // Block 2: Write the system prompt to get the filters from user query 
        //====================================================================================

         /* Inser your code here */

        //END 
       

        const oFilter = JSON.parse(response.getContent());

        console.log(oFilter);

        //====================================================================================
        // Block 3:  Initialize the embedding client and get the embeddings
        //====================================================================================

         /* Inser your code here */
       
        //END

        //====================================================================================
        // Block 4:  Perform similarity search
        //====================================================================================

        /* Inser your code here */

        //END

       let finalResults = [], textData = '';
       for (const result of similarityResults) {
            finalResults.push(JSON.parse(result.SUPPLIERMETADATA.toString('utf8')))
            textData =  result.SUPPLIERTEXT + '\n' + textData
        }

        //====================================================================================
        // Block 5:  Call LLM to format the result
        //====================================================================================

         /* Inser your code here */

        //END

        console.log('formatResult', formatResult.getContent())

        finalResults = JSON.parse(formatResult.getContent());

        const {mimeType, base64Image} = await getLogo() 

        //Attach logo
        finalResults.map( e => e.Logo = `data:${mimeType};base64,${base64Image}` )

       return finalResults;

    });


    const fetchSuppliersList = async () => {

        //=========================================================================================
        // connect to the S4 destination
        //=========================================================================================

            /* Inser your code here */

        //EDN        
      
        // Remove duplicates         
        const purchasingData = [...new Map(aMSData.map(item => [item.Material, item])).values()]

         oS4Connection.path = 'API_PRODUCT_SRV'

        //Fetch material description
        async function getProductText() {
            const aPText = purchasingData.map(async (s) => {
                return await oS4Connection.send(
                   'GET', `A_Product('${s.Material}')/to_Description/?$filter=Language eq 'EN'&top=1`
                );
            });

            const aProdctText = await Promise.all(aPText);
            return aProdctText;
        }

        const aProductText = await getProductText();

        console.log('aProductText', aProductText.length);

        oS4Connection.path = 'API_BUSINESS_PARTNER'

         //Fetch suppliers address
        async function getAddresses() {
            const aAddresses = purchasingData.map(async (s) => {
                return await oS4Connection.send(
                    'GET', `A_BusinessPartner('${s.Supplier}')/to_BusinessPartnerAddress?$select=CityName,Country,BusinessPartner,FullName`
                );
            });

            let aAddressesData = await Promise.all(aAddresses);
            //console.log(aAddressesData);
            return aAddressesData;
        }

        const aAddressesData = await getAddresses();

        console.log('allAddresses data', aAddressesData.length)

        //Fetch suppliers email
        async function getEmail() {
            const aEmail = purchasingData.map(async (s) => {
                return await oS4Connection.send(
                    'GET', `A_BusinessPartner('${s.Supplier}')/to_AddressIndependentEmail`
                );
            });

            let aEmailData = await Promise.all(aEmail);
            console.log(aEmailData);
            return aEmailData;
        }

        const aEmailData = await getEmail();
        console.log('aEmail data', aEmailData.length);


        //Fetch suppliers ratings
        async function getRating() {
            const aRating = purchasingData.map(async (s) => {
               return await oS4Connection.send(
                    'GET', `A_BusinessPartner('${s.Supplier}')/to_BusinessPartnerRating`
                );
            });

            let aRatingData = await Promise.all(aRating);
            return aRatingData;
        }

        const aRatingData = await getRating();
        console.log('Rating data', aRatingData.length);


        //Fetch suppliers phone number
        async function getPhoneNumber() {
            const aPhoneNumber = purchasingData.map(async (s) => {
               return await oS4Connection.send(
                    'GET', `A_BusinessPartner('${s.Supplier}')/to_AddressIndependentPhone?$select=BusinessPartner,PhoneNumber,PhoneNumberExtension`
                );
            });

            let aPhoneNumberData = await Promise.all(aPhoneNumber);
            //console.log(aEmailData);
            return aPhoneNumberData;
        }

        const aPhoneNumberData = await getPhoneNumber();
        console.log('Phone number data', aPhoneNumberData.length);

        oS4Connection.path = 'API_COUNTRY_SRV' 

        //Fetch country full name
        async function getCountryFulllName() {
            const aCountryFullName = aAddressesData.map(async (s, i) => {
               return await oS4Connection.send(
                    'GET', `A_CountryText?$filter=Country eq '${s[0].Country}' and Language eq 'EN'`
                );
            });

            let aCountryFullNameData = await Promise.all(aCountryFullName);
            return aCountryFullNameData;
        }

        const aCountryFullNameData = await getCountryFulllName();
        console.log('Country Full Name data', aCountryFullNameData.length);

        let result = []
        
        for (const purchasing of purchasingData) {

            const oProductText = aProductText.find( (v, i)=> { 
                if (v[0]?.Product === purchasing.Material) return v[0] 
            })
            const oAddressText = aAddressesData.find ( (v, i)=> {
                if ( v[0]?.BusinessPartner === purchasing.Supplier) return v[0]
            })
            const oEmail = aEmailData.find ( (v, i)=> {
                if ( v[0]?.BusinessPartner === purchasing.Supplier) return v[0]
            })
            const oPhone = aPhoneNumberData.find ( (v, i)=> {
                if ( v[0]?.BusinessPartner === purchasing.Supplier) return v[0]
            })
            const oRating = aRatingData.find ( (v, i)=> {
                if ( v[0]?.BusinessPartner === purchasing.Supplier) return v[0]
            })

            let sCountryCode = oAddressText && oAddressText.length > 0 ? oAddressText[0]?.Country : ''

            const oCountryFullName = aCountryFullNameData.find ( (v, i)=> {
                if ( v[0]?.Country === sCountryCode) return v[0]
            })

            const rating = parseFloat((Math.random() * 4 + 1).toFixed(1)); //Math.floor(Math.random() * 5) + 1;

            result.push({
                Supplier: purchasing.Supplier,
                SupplierName: oAddressText && oAddressText.length> 0 ? oAddressText[0]?.FullName : '',
                Product: purchasing.Material,
                ProductText: oProductText && oProductText.length> 0 ? oProductText[0]?.ProductDescription : '',
                City: oAddressText && oAddressText.length> 0 ? oAddressText[0]?.CityName : '',
                Country: oCountryFullName && oCountryFullName.length > 0 ? oCountryFullName[0].CountryName : '',
                Email: oEmail && oEmail.length > 0 ? oEmail[0]?.EmailAddress : '',
                Phone: oPhone && oPhone.length > 0 ? oPhone[0]?.PhoneNumber : '',
                Rating: oRating && oRating.length > 0 ? oRating[0]?.BusinessPartnerRatingGrade : rating,
                Status:'Active'
                
            })
        }

        return result;
    }

    getLogo = async () => {
         const fs = require('fs').promises;
         const path = require('path');
         const imagePath = path.join(__dirname, 'images', 'pngtree.jpg');

         const imageBuffer = await fs.readFile(imagePath);
         const base64Image = imageBuffer.toString('base64');
         const mimeType = 'image/png'; 

         return {
            mimeType,
            base64Image
         }
    } 


} 