import _ from 'lodash';

import UserResolver from './user';
import PostResolver from './post';


const resolversArray: Array<any> = [UserResolver, PostResolver];
const Resolver: any = {};

// 리졸버 합치기
_.forEach(resolversArray, _resolver => {
	const schemaTypes = _.keys(_resolver);
	_.forEach(schemaTypes, schema => {
		if (Resolver[schema]) {
			Resolver[schema] = _.assign(Resolver[schema], _resolver[schema]);
		} else {
			Resolver[schema] = _resolver[schema];
		}
	});
});

export default Resolver;
