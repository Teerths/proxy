import { parse, serialize } from '../../cookie/parse';

export default function cookie(self: any) {
    self.__dynamic.cookie = {
        str: self.__dynamic$cookie||'',
        desc: Object.getOwnPropertyDescriptor(self.Document.prototype, 'cookie')
    };

    delete self.Document.prototype.cookie;

    self.__dynamic.define(self.document, 'cookie', {
        get() {
            return self.__dynamic.cookie.str || self.__dynamic.cookie.desc.get.call(this) || '';
        },
        set(val: any) {
            var parsed = self.__dynamic.modules.setCookieParser.parse(val, {decodeValues: false})[0];

            Promise.resolve(self.__dynamic.cookies.set(self.__dynamic.location.host, self.__dynamic.modules.cookie.serialize(parsed.name, parsed.value, {...parsed, encode: (e:any) => e}))).then(async (e:any)=>{
                self.__dynamic.cookie.str = await self.__dynamic.cookies.get(self.__dynamic.location.host);
            });

            var cookies = parse(self.__dynamic.cookie.str || '');

            cookies[parsed.name] = parsed.value;

            self.__dynamic.cookie.str = serialize(Object.entries(cookies).map(e=>({ name: e[0], value: e[1] })));
        }
    });

    if (self.navigator.serviceWorker) try {
        self.navigator.serviceWorker.onmessage = ({ data }: any) => {
            if (data.host==self.__dynamic.location.host && data.type == 'set-cookie') {
                    var parsed = self.__dynamic.modules.cookie.parse(data.val);
                    var cookies = parse(self.__dynamic.cookie.str || '');

                    cookies[Object.entries(parsed)[0][0]] = Object.entries(parsed)[0][1];

                    self.__dynamic.cookie.str = serialize(Object.entries(cookies).map(e=>({ name: e[0], value: e[1] })));
            }

            if (data.host==self.__dynamic.location.host && data.type == 'cookies') {
                Promise.resolve().then(async () => {
                    self.__dynamic.cookie.str = await self.__dynamic.cookies.get(self.__dynamic.location.host);
                });
            }
        };
    } catch {};
}