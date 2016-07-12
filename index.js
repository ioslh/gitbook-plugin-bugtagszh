module.exports = {
    website: {
        assets: './assets',
        js: [
            'bugtags.js'
        ],
        css: [
            'bugtags.css'
        ]
    },
    blocks:{
        sliceDesc:{
            process:function( blk ){
                console.log( blk.body )
                return "Hello World " + blk.body
            }
        }
    },
    filters:{
        testme:function( str ){
            return "FILTER WORKS HERE " + str
        }
    },
    hooks:{
        "page:before":function( page ){
            console.log("----------------------")
            console.log( page.title )
            return page
        }
    }
};
