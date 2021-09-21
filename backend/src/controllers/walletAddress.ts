import { Response, Request } from "express";

import { WalletAddress } from '../models/wallet_address';
import BadRequestError from "../exceptions/BadRequestError";
import { http } from "./http";
import { generateMnemonic } from "../utils/utils";

export const createWallets = async (req: Request, res: Response) => {
	try {
    const addresses = [
      'addr1qxhtwahzgwpem8vtvz32zxuhaehxlzg4k3tmhuemtfrxsmsf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7qx8jv2n','addr1q9xm02k5zzcz8ljdwfrtts2ckwesm0cqr7c0u25fngyzfxsf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7qx0rt7h','addr1q93cj3cw4e9l74ljerfqdna5ptyr2l2g34j9p2v5sddzw8sf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7qp435xn','addr1qx8nche35aw2qucsudtcgjnay5n568xauaarjev9sqyestgf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7qt6l384','addr1q9zvxyzjzzsxmcmac0acdwnx4207wez6ghtkgkp7e3a6awcf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7qnapyjz','addr1q94x0m4swhpnw4aelflzq2hkprg9yxxns233yeljp4832ycf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7qmut9sy','addr1qykntee40xc00xzfcqmmsw8mskx6uqm9f2zkhgme0fcj9kcf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7qzjqu3j','addr1q89hcawnp8r5kw3jagyzf84rm6ccp9majtrggdgrtcpmzrcf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7q92w0sq','addr1qxfhk72xy4zaatn3f3k5pdmdv5gxysl892cdnkzz5hcwpmcf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7q9azwwh','addr1qy4lygkda2vvwv5ts09yn6rnlaazftxud2dzm8e274shkkgf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7q0df9eq','addr1qxvmfcasmskckaukcjap4ees3tay6kazf0dr60l4tz9mydsf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7q077rem','addr1qxur8p29w9f5fte3peyk36qr9ndzwx3ksu75e09m88yuvlqf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7q2smf3n','addr1qy7l3a5anyhd4fh6akld6eqzsa2pc2xgeu8vmme4ykr22kgf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7q8fl7xu','addr1q83nj3gq0luxnvzdmws8p7n4m3vzk3duvxhf3gtl335z53cf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7q8u2gjd','addr1q9aeqadv65ehnwrcptga6r2j9x8x9gd6gt8jtze8vsnpjucf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7qwzpdx6','addr1q8xypqfdte40g3hez8lute5vm62jktkw2fg72hca8694uusf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7q4rqa2m','addr1qxqspdqfae5t8udg79hgdacsty3d6f8cfpct3n904y8h9dcf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7q78u88e','addr1q8hxr9kfgfgnk726uukv6j5d9gh6mcft4rc2mh9078s8mcgf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7q65qudv','addr1qyye729xcppw4qtd0cvnx3zvz3gs2jvrkpapc5kkpy29xuqf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7qn8jwth','addr1qylwp2n8aq9t6mzv26qs6kq56ajhq0xqe9anwxtu9fd6magf3j0d4dde73n8u265jay2s4xwp82r6f639jl6ummcxz7q5mszn0','addr1qxdqw6de7tvnwrt4ar8xerp3r8kulu0en9cpmnxa5tp8d0xrmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86qtuwh5l','addr1qxefa89ytxz2lxml52fwh7afjc2ggj7jwk8d7epqr3ztq67rmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86qg26ruh','addr1q9khplfuclt6qn53e8fqftduu74nnmk4f4d3jgjcp3eaapkrmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86q7agp3n','addr1q80rj0k6ur9amxcnh0qmrnnhtn9uefxux8e7fustv7q2vtxrmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86qkv3rvh','addr1q9ny8ktqwnafrkwxstartc70g8635c4a2uruw8qq47x8vmkrmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86qy49hm3','addr1qxn0ktqznpp2q7mmy96zerqhc8mkc46rmn64r6mc05xtt3xrmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86qhphyx0','addr1q9d27g5pnvp9p7064xanjrcqq6uduyv0mspgxymv5jxd987rmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86qlg2h04','addr1q9s2z5xm7xh3w4v8y66a0tylry8skx70shudnp8aqzyqrgwrmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86qm8tpq2','addr1q86nx8rrj5j9tf8gzl55wx9pur57t5xyf7z69rqzlghkpwwrmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86q656ce8','addr1qyyksnhe5aw2f6dlkmrffqdtjyg97yqltqxq9e3dc6ls28krmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86q7f4rxa','addr1q95qrwjr30f0k42j4mv8s7338lwh3mck2jyfnmj2tgszpp7rmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86qz44thd','addr1q8qs7ur9lgqc7574erp7n8np97zuz298m25tmyjht042ww7rmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86q3n3pj8','addr1q9j6gzxjqlf6kntf04t25rv7rr446hxk2av34xtq4jm3x0xrmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86q2atuwy','addr1q8quk8x6286huz0zywkzj7r07yn7ykepxa4xs32lxksc0nwrmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86qq2av2t','addr1qy6n0sy0lf4f3txfpha865xw6yff4c0jke95479e9jch047rmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86qfmu3ww','addr1q9w8qddam7kttk45q5hlkqym6kcpjs0rpy8gjgkwf8g200xrmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86qj7gzl4','addr1qy72pp2c4xd59cay903dhyfk87dt4m5jttpw85n9f7flnmkrmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86qatucpp','addr1qypshxwkm88dhaxufezvnrnrhhum7xjm827l34l06m3687wrmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86qfl4cka','addr1q85kdx3jeuk66cl4rmy48p0yygf3h5kw7nszpwmkpsuvc0xrmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86qgsuvug','addr1qy636peyyglq6336mnvlfrw3l7dwjydpva68mswelmkd3dxrmn3x7fnhq9jywg6vdkxh84qu5eaw9yusagpp348qu86qqgr89l','addr1q8x8qa88qhtstnnc39zfywr7utm4akh0w63yk4mc6nma8kl7y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueqhttzaw','addr1q8vpanynhdv84rp4gvp8203l8lwxegqp8cu8puls6wfw9dl7y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueqje0a04','addr1qxyyetn5prty6twqczy2ra26e30rd3vv9vvm8qj2kepcqal7y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueqx6438x','addr1qx22gg2k7wtpjt6y0qe8vvw5zfpj9d95ywe963pp7sltgq07y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueqccr2ke','addr1q8fsan7ak8hrvcz37xsdmevgg9uy8mj0adxd62wh5nk57z07y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueqrfc5tf','addr1qxs2pq3dz7yex0anhsxw3yp58mqjc59h4kmfe30p76d46nh7y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueqz6hp9f','addr1q8g7h9vk7zqwfxe646xpsdzh64kvmulc0f652a3utdgm06l7y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueqhg0yxp','addr1qy506hw6m8mwy64d8ggwq2mc98twvfzjl83lh4amx4m8cw07y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueqjyq8gs','addr1q8a72lrfz8sanxv98tuk79rdnlustmdms9gg7wdrnuc3hml7y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueqe5e0gv','addr1qyslcc0dgws6a85q8cz6yp3z604ehjfhum57menhkuervl07y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueqrnwz7r','addr1qykwnvpkk40cfqj20lzcy7gk89epjkn49u2yxylgukn8klh7y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueqzny845','addr1qy5pchh9ws7z3vjtdjel7sa56xjc99qdk992gsyqpla7pl07y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueqnvdksg','addr1q8gz6605glu5ezk5j5xfgskktwlgvul7sfllzjfua47yat07y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueq4ax075','addr1q8fmedu0dn9ulx3cw60m6rftlfuta9m9e4vkkmpumk5p9h87y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueqyvmpw7','addr1qxsg07sp4ax2x5k6vhslx96ary22zsdu5zyry27ka8zjah07y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueqxczm6d','addr1qyngxv4tetd38mlvynuxhuu3gswu3ehvdahhzlv340w6w5h7y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueqjjtjaw','addr1qx8u36m7nve9w7enzs8hhzzr7juk86rjrw6v39z5tygc2uh7y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueq9thdv3','addr1q95dtk3wvu2fkazdxv0zl0xdvsws2glhkquvvl8exwn27ch7y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueqt4hfca','addr1qxwc6fgz80kk98lg9jrf6jhj5kfjgwzee8nw3p5yjnf6syh7y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueq9eegdh','addr1qx4n7j2y6xucftxpdk8y78ycc3vyrazslqak63qp8vqawhl7y4z4rpfj3zu4xtx2wkzwkr867eewrrdceprtycm8rueqs9dujy'
    ]

    for (let i = 0; i < addresses.length; i ++) {
      let data = new WalletAddress();
      data.address = addresses[i];
      await data.save();
    }
    // const WALLET_COUNT = parseInt(process.env.CARDANO_WALLET_COUNT || '1');
    // for (let j = 0; j < WALLET_COUNT; j ++) {
    //   let MNEMONICS = generateMnemonic(15);
    //   let cardanoData = await http.post<any>("/wallets", {
    //     name: "test_cf_1",
    //     mnemonic_sentence: MNEMONICS.split(" "),
    //     passphrase: "test123456"
    //   });
    //   console.log('cardanoWalletId: ', cardanoData.data.id);
    //   cardanoData = await http.get<any>(`/wallets/${cardanoData.data.id}/addresses?state=unused`);

    //   for (let i = 0; i < cardanoData.data.length; i ++) {
    //     let data = new WalletAddress();
    //     data.address = cardanoData.data[i].id;
    //     await data.save();
    //   }
    // }
    return res.status(201).send({status: 'creation_success'});
	}
	catch (error) {
    console.log(error);
		if (error.code === 11000) {
			return res.status(400).send(new BadRequestError("ID and/or username already exist."));
		}
		else {
			return res.status(400).send(new BadRequestError("Bad Request."));
		}
	}
};
