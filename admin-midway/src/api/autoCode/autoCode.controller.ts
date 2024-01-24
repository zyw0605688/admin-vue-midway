import {Body, Controller, Post} from '@midwayjs/core';

@Controller()
export class autoCodeController {
  @Post('/autoCode/create',)
  async create(@Body() req) {
    console.log(req)
    const temp = {
      fileName: 'productType',
      tableName: 'product_type',
      fields: [{
        fieldName: 'product_type_align',
        fieldType: 'string',
        fieldSearchType: 'LIKE',
        dictType: '',
        dataTypeLong: '255',
        require: true,
        clearable: false,
        comment: '别名'
      },
        {
          fieldName: 'product_type_align',
          fieldType: 'string',
          fieldSearchType: 'LIKE',
          dictType: '',
          dataTypeLong: '255',
          require: true,
          clearable: false,
          comment: '别名'
        }
      ]
    }
    console.log(temp)
    return {};
  }
}
