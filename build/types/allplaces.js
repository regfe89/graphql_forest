"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AllplacesType = void 0;

var _graphql = require("graphql");

var _pg = require("pg");

const conString = 'postgres://postgres:@192.168.20.78/forest_bd';
const pool = new _pg.Pool({
  connectionString: conString
});
const oblast_list = new _graphql.GraphQLObjectType({
  name: "oblast_list",
  fields: () => ({
    oblast_id: {
      type: _graphql.GraphQLString
    },
    oblast_ru: {
      type: _graphql.GraphQLString
    },
    oblast_ky: {
      type: _graphql.GraphQLString
    },
    oblast_en: {
      type: _graphql.GraphQLString
    },
    geom: {
      type: _graphql.GraphQLString
    },
    leshoz_list: {
      type: new _graphql.GraphQLList(leshoz_list),
      resolve: oblast_id => getLeshozList(oblast_id)
    }
  })
});
const leshoz_list = new _graphql.GraphQLObjectType({
  name: "leshoz_list",
  fields: () => ({
    leshoz_id: {
      type: _graphql.GraphQLString
    },
    leshoz_ru: {
      type: _graphql.GraphQLString
    },
    geom: {
      type: _graphql.GraphQLString
    },
    leshoztype_id: {
      type: _graphql.GraphQLString
    },
    forestries_list: {
      type: new _graphql.GraphQLList(forestries_list),
      resolve: leshoz_id => getForestriesList(leshoz_id)
    }
  })
});
const forestries_list = new _graphql.GraphQLObjectType({
  name: "forestries_list",
  fields: () => ({
    gid: {
      type: _graphql.GraphQLString
    },
    geom: {
      type: _graphql.GraphQLString
    },
    forestry_ru: {
      type: _graphql.GraphQLString
    },
    forestry_num: {
      type: _graphql.GraphQLString
    },
    forestrytype_id: {
      type: _graphql.GraphQLString
    } // block_list: {
    //   type: new GraphQLList(block_list),
    //   resolve: gid => getBlockList(gid)
    // },

  })
}); // const block_list = new GraphQLObjectType({
//   name: "block_list",
//   fields: () => ({
//     gid: { type: GraphQLString },
//     geom: { type: GraphQLString },
//     forestry_id: { type: GraphQLString },
//     block_num: { type: GraphQLString },
//     stand_list: {
//       type: new GraphQLList(stand_list),
//       resolve: gid => getStandList(gid)
//     },
//   })
// });
// const stand_list = new GraphQLObjectType({
//   name: "stand_list",
//   fields: () => ({
//     gid: { type: GraphQLString },
//     geom: { type: GraphQLString },
//     leshoz_num: { type: GraphQLString },
//     block_num: { type: GraphQLString },
//     forestry_num: { type: GraphQLString },
//     stand_code: { type: GraphQLString },
//     stand_num: { type: GraphQLString },
//   })
// });

const AllplacesType = new _graphql.GraphQLObjectType({
  name: "Allplaces",
  fields: {
    oblasts: {
      type: new _graphql.GraphQLList(oblast_list),
      resolve: () => getOblastList()
    }
  }
});
exports.AllplacesType = AllplacesType;

const getOblastList = () => {
  return new Promise((resolve, reject) => {
    pool.connect(function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }

      client.query('SELECT oblast_id, oblast_ru FROM topo.oblast', function (err, result) {
        done();

        if (err) {
          return reject(console.error('error happened during query', err));
        }

        resolve(result.rows);
      });
    });
  });
};

const getLeshozList = gid => {
  return new Promise((resolve, reject) => {
    pool.connect(function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }

      client.query('SELECT leshoz_id, leshoz_ru, leshoztype_id FROM forest.leshoz WHERE oblast_id =' + gid.oblast_id, function (err, result) {
        done();

        if (err) {
          return reject(console.error('error happened during query', err));
        }

        resolve(result.rows);
      });
    });
  });
};

const getForestriesList = leshoz => {
  return new Promise((resolve, reject) => {
    pool.connect(function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }

      client.query('SELECT gid, forestry_ru, forestrytype_id, forestry_num FROM forest.forestry WHERE leshoz_id =' + leshoz.leshoz_id, function (err, result) {
        done();

        if (err) {
          return reject(console.error('error happened during query', err));
        }

        resolve(result.rows);
      });
    });
  });
}; // const getBlockList = (forestry) => {
//   return new Promise((resolve, reject) => {
//     pool.connect(function (err, client, done) {
//       if (err) {
//         return console.error('error fetching client from pool', err)
//       }
//       client.query('SELECT gid, block_num, forestry_id FROM forest.block WHERE forestry_id =' + forestry.gid, function (err, result) {
//         done()
//         if (err) {
//           return reject(console.error('error happened during query', err))
//         }
//         resolve(result.rows)
//       })
//     })
//   }
//   )
// }
// const getStandList = (block) => {
//   return new Promise((resolve, reject) => {
//     pool.connect(function (err, client, done) {
//       if (err) {
//         return console.error('error fetching client from pool', err)
//       }
//       client.query('SELECT gid, leshoz_num, block_num, forestry_num, stand_num FROM forest.stand WHERE block_id =' + block.gid, function (err, result) {
//         done()
//         if (err) {
//           return reject(console.error('error happened during query', err))
//         }
//         resolve(result.rows)
//       })
//     })
//   }
//   )
// }
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90eXBlcy9hbGxwbGFjZXMuanMiXSwibmFtZXMiOlsiY29uU3RyaW5nIiwicG9vbCIsIlBvb2wiLCJjb25uZWN0aW9uU3RyaW5nIiwib2JsYXN0X2xpc3QiLCJHcmFwaFFMT2JqZWN0VHlwZSIsIm5hbWUiLCJmaWVsZHMiLCJvYmxhc3RfaWQiLCJ0eXBlIiwiR3JhcGhRTFN0cmluZyIsIm9ibGFzdF9ydSIsIm9ibGFzdF9reSIsIm9ibGFzdF9lbiIsImdlb20iLCJsZXNob3pfbGlzdCIsIkdyYXBoUUxMaXN0IiwicmVzb2x2ZSIsImdldExlc2hvekxpc3QiLCJsZXNob3pfaWQiLCJsZXNob3pfcnUiLCJsZXNob3p0eXBlX2lkIiwiZm9yZXN0cmllc19saXN0IiwiZ2V0Rm9yZXN0cmllc0xpc3QiLCJnaWQiLCJmb3Jlc3RyeV9ydSIsImZvcmVzdHJ5X251bSIsImZvcmVzdHJ5dHlwZV9pZCIsIkFsbHBsYWNlc1R5cGUiLCJvYmxhc3RzIiwiZ2V0T2JsYXN0TGlzdCIsIlByb21pc2UiLCJyZWplY3QiLCJjb25uZWN0IiwiZXJyIiwiY2xpZW50IiwiZG9uZSIsImNvbnNvbGUiLCJlcnJvciIsInF1ZXJ5IiwicmVzdWx0Iiwicm93cyIsImxlc2hveiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUVBLE1BQU1BLFNBQVMsR0FBRyw4Q0FBbEI7QUFDQSxNQUFNQyxJQUFJLEdBQUcsSUFBSUMsUUFBSixDQUFTO0FBQ3BCQyxFQUFBQSxnQkFBZ0IsRUFBRUg7QUFERSxDQUFULENBQWI7QUFJQSxNQUFNSSxXQUFXLEdBQUcsSUFBSUMsMEJBQUosQ0FBc0I7QUFDeENDLEVBQUFBLElBQUksRUFBRSxhQURrQztBQUV4Q0MsRUFBQUEsTUFBTSxFQUFFLE9BQU87QUFDYkMsSUFBQUEsU0FBUyxFQUFFO0FBQUVDLE1BQUFBLElBQUksRUFBRUM7QUFBUixLQURFO0FBRWJDLElBQUFBLFNBQVMsRUFBRTtBQUFFRixNQUFBQSxJQUFJLEVBQUVD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aUIsR0FBSW1CLE1BQUQsSUFBWTtBQUNwQyxTQUFPLElBQUlYLE9BQUosQ0FBWSxDQUFDZCxPQUFELEVBQVVlLE1BQVYsS0FBcUI7QUFDdEMvQixJQUFBQSxJQUFJLENBQUNnQyxPQUFMLENBQWEsVUFBVUMsR0FBVixFQUFlQyxNQUFmLEVBQXVCQyxJQUF2QixFQUE2QjtBQUN4QyxVQUFJRixHQUFKLEVBQVM7QUFDUCxlQUFPRyxPQUFPLENBQUNDLEtBQVIsQ0FBYyxpQ0FBZCxFQUFpREosR0FBakQsQ0FBUDtBQUNEOztBQUNEQyxNQUFBQSxNQUFNLENBQUNJLEtBQVAsQ0FBYSxrR0FBa0dHLE1BQU0sQ0FBQ3ZCLFNBQXRILEVBQWlJLFVBQVVlLEdBQVYsRUFBZU0sTUFBZixFQUF1QjtBQUN0SkosUUFBQUEsSUFBSTs7QUFDSixZQUFJRixHQUFKLEVBQVM7QUFDUCxpQkFBT0YsTUFBTSxDQUFDSyxPQUFPLENBQUNDLEtBQVIsQ0FBYyw2QkFBZCxFQUE2Q0osR0FBN0MsQ0FBRCxDQUFiO0FBQ0Q7O0FBQ0RqQixRQUFBQSxPQUFPLENBQUN1QixNQUFNLENBQUNDLElBQVIsQ0FBUDtBQUNELE9BTkQ7QUFPRCxLQVhEO0FBWUQsR0FiTSxDQUFQO0FBZUQsQ0FoQkQsQyxDQW1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdyYXBoUUxPYmplY3RUeXBlLCBHcmFwaFFMU3RyaW5nLCBHcmFwaFFMRmxvYXQsIEdyYXBoUUxMaXN0IH0gZnJvbSBcImdyYXBocWxcIjtcbmltcG9ydCB7IFBvb2wgfSBmcm9tICdwZydcblxuY29uc3QgY29uU3RyaW5nID0gJ3Bvc3RncmVzOi8vcG9zdGdyZXM6QDE5Mi4xNjguMjAuNzgvZm9yZXN0X2JkJ1xuY29uc3QgcG9vbCA9IG5ldyBQb29sKHtcbiAgY29ubmVjdGlvblN0cmluZzogY29uU3RyaW5nXG59KTtcblxuY29uc3Qgb2JsYXN0X2xpc3QgPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xuICBuYW1lOiBcIm9ibGFzdF9saXN0XCIsXG4gIGZpZWxkczogKCkgPT4gKHtcbiAgICBvYmxhc3RfaWQ6IHsgdHlwZTogR3JhcGhRTFN0cmluZyB9LFxuICAgIG9ibGFzdF9ydTogeyB0eXBlOiBHcmFwaFFMU3RyaW5nIH0sXG4gICAgb2JsYXN0X2t5OiB7IHR5cGU6IEdyYXBoUUxTdHJpbmcgfSxcbiAgICBvYmxhc3RfZW46IHsgdHlwZTogR3JhcGhRTFN0cmluZyB9LFxuICAgIGdlb206IHsgdHlwZTogR3JhcGhRTFN0cmluZyB9LFxuICAgIGxlc2hvel9saXN0OiB7XG4gICAgICB0eXBlOiBuZXcgR3JhcGhRTExpc3QobGVzaG96X2xpc3QpLFxuICAgICAgcmVzb2x2ZTogb2JsYXN0X2lkID0+IGdldExlc2hvekxpc3Qob2JsYXN0X2lkKVxuICAgIH0sXG5cblxuICB9KVxufSk7XG5cbmNvbnN0IGxlc2hvel9saXN0ID0gbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcbiAgbmFtZTogXCJsZXNob3pfbGlzdFwiLFxuICBmaWVsZHM6ICgpID0+ICh7XG4gICAgbGVzaG96X2lkOiB7IHR5cGU6IEdyYXBoUUxTdHJpbmcgfSxcbiAgICBsZXNob3pfcnU6IHsgdHlwZTogR3JhcGhRTFN0cmluZyB9LFxuICAgIGdlb206IHsgdHlwZTogR3JhcGhRTFN0cmluZyB9LFxuICAgIGxlc2hvenR5cGVfaWQ6IHsgdHlwZTogR3JhcGhRTFN0cmluZyB9LFxuICAgIGZvcmVzdHJpZXNfbGlzdDoge1xuICAgICAgdHlwZTogbmV3IEdyYXBoUUxMaXN0KGZvcmVzdHJpZXNfbGlzdCksXG4gICAgICByZXNvbHZlOiBsZXNob3pfaWQgPT4gZ2V0Rm9yZXN0cmllc0xpc3QobGVzaG96X2lkKVxuICAgIH0sXG4gIH0pXG59KTtcblxuY29uc3QgZm9yZXN0cmllc19saXN0ID0gbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcbiAgbmFtZTogXCJmb3Jlc3RyaWVzX2xpc3RcIixcbiAgZmllbGRzOiAoKSA9PiAoe1xuICAgIGdpZDogeyB0eXBlOiBHcmFwaFFMU3RyaW5nIH0sXG4gICAgZ2VvbTogeyB0eXBlOiBHcmFwaFFMU3RyaW5nIH0sXG4gICAgZm9yZXN0cnlfcnU6IHsgdHlwZTogR3JhcGhRTFN0cmluZyB9LFxuICAgIGZvcmVzdHJ5X251bTogeyB0eXBlOiBHcmFwaFFMU3RyaW5nIH0sXG4gICAgZm9yZXN0cnl0eXBlX2lkOiB7IHR5cGU6IEdyYXBoUUxTdHJpbmcgfSxcbiAgICAvLyBibG9ja19saXN0OiB7XG4gICAgLy8gICB0eXBlOiBuZXcgR3JhcGhRTExpc3QoYmxvY2tfbGlzdCksXG4gICAgLy8gICByZXNvbHZlOiBnaWQgPT4gZ2V0QmxvY2tMaXN0KGdpZClcbiAgICAvLyB9LFxuICB9KVxufSk7XG5cbi8vIGNvbnN0IGJsb2NrX2xpc3QgPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xuLy8gICBuYW1lOiBcImJsb2NrX2xpc3RcIixcbi8vICAgZmllbGRzOiAoKSA9PiAoe1xuLy8gICAgIGdpZDogeyB0eXBlOiBHcmFwaFFMU3RyaW5nIH0sXG4vLyAgICAgZ2VvbTogeyB0eXBlOiBHcmFwaFFMU3RyaW5nIH0sXG4vLyAgICAgZm9yZXN0cnlfaWQ6IHsgdHlwZTogR3JhcGhRTFN0cmluZyB9LFxuLy8gICAgIGJsb2NrX251bTogeyB0eXBlOiBHcmFwaFFMU3RyaW5nIH0sXG4vLyAgICAgc3RhbmRfbGlzdDoge1xuLy8gICAgICAgdHlwZTogbmV3IEdyYXBoUUxMaXN0KHN0YW5kX2xpc3QpLFxuLy8gICAgICAgcmVzb2x2ZTogZ2lkID0+IGdldFN0YW5kTGlzdChnaWQpXG4vLyAgICAgfSxcbi8vICAgfSlcbi8vIH0pO1xuXG4vLyBjb25zdCBzdGFuZF9saXN0ID0gbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcbi8vICAgbmFtZTogXCJzdGFuZF9saXN0XCIsXG4vLyAgIGZpZWxkczogKCkgPT4gKHtcbi8vICAgICBnaWQ6IHsgdHlwZTogR3JhcGhRTFN0cmluZyB9LFxuLy8gICAgIGdlb206IHsgdHlwZTogR3JhcGhRTFN0cmluZyB9LFxuLy8gICAgIGxlc2hvel9udW06IHsgdHlwZTogR3JhcGhRTFN0cmluZyB9LFxuLy8gICAgIGJsb2NrX251bTogeyB0eXBlOiBHcmFwaFFMU3RyaW5nIH0sXG4vLyAgICAgZm9yZXN0cnlfbnVtOiB7IHR5cGU6IEdyYXBoUUxTdHJpbmcgfSxcbi8vICAgICBzdGFuZF9jb2RlOiB7IHR5cGU6IEdyYXBoUUxTdHJpbmcgfSxcbi8vICAgICBzdGFuZF9udW06IHsgdHlwZTogR3JhcGhRTFN0cmluZyB9LFxuLy8gICB9KVxuLy8gfSk7XG5cblxuZXhwb3J0IGNvbnN0IEFsbHBsYWNlc1R5cGUgPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xuICBuYW1lOiBcIkFsbHBsYWNlc1wiLFxuICBmaWVsZHM6IHtcbiAgICBvYmxhc3RzOiB7XG4gICAgICB0eXBlOiBuZXcgR3JhcGhRTExpc3Qob2JsYXN0X2xpc3QpLFxuICAgICAgcmVzb2x2ZTogKCkgPT4gZ2V0T2JsYXN0TGlzdCgpXG4gICAgfVxuICB9XG59KTtcblxuXG5jb25zdCBnZXRPYmxhc3RMaXN0ID0gKCkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHBvb2wuY29ubmVjdChmdW5jdGlvbiAoZXJyLCBjbGllbnQsIGRvbmUpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIGZldGNoaW5nIGNsaWVudCBmcm9tIHBvb2wnLCBlcnIpXG4gICAgICB9XG4gICAgICBjbGllbnQucXVlcnkoJ1NFTEVDVCBvYmxhc3RfaWQsIG9ibGFzdF9ydSBGUk9NIHRvcG8ub2JsYXN0JywgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgIGRvbmUoKVxuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChjb25zb2xlLmVycm9yKCdlcnJvciBoYXBwZW5lZCBkdXJpbmcgcXVlcnknLCBlcnIpKVxuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUocmVzdWx0LnJvd3MpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgKVxufVxuXG5jb25zdCBnZXRMZXNob3pMaXN0ID0gKGdpZCkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHBvb2wuY29ubmVjdChmdW5jdGlvbiAoZXJyLCBjbGllbnQsIGRvbmUpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIGZldGNoaW5nIGNsaWVudCBmcm9tIHBvb2wnLCBlcnIpXG4gICAgICB9XG4gICAgICBjbGllbnQucXVlcnkoJ1NFTEVDVCBsZXNob3pfaWQsIGxlc2hvel9ydSwgbGVzaG96dHlwZV9pZCBGUk9NIGZvcmVzdC5sZXNob3ogV0hFUkUgb2JsYXN0X2lkID0nICsgZ2lkLm9ibGFzdF9pZCwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgIGRvbmUoKVxuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChjb25zb2xlLmVycm9yKCdlcnJvciBoYXBwZW5lZCBkdXJpbmcgcXVlcnknLCBlcnIpKVxuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUocmVzdWx0LnJvd3MpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgKVxufVxuXG5jb25zdCBnZXRGb3Jlc3RyaWVzTGlzdCA9IChsZXNob3opID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBwb29sLmNvbm5lY3QoZnVuY3Rpb24gKGVyciwgY2xpZW50LCBkb25lKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKCdlcnJvciBmZXRjaGluZyBjbGllbnQgZnJvbSBwb29sJywgZXJyKVxuICAgICAgfVxuICAgICAgY2xpZW50LnF1ZXJ5KCdTRUxFQ1QgZ2lkLCBmb3Jlc3RyeV9ydSwgZm9yZXN0cnl0eXBlX2lkLCBmb3Jlc3RyeV9udW0gRlJPTSBmb3Jlc3QuZm9yZXN0cnkgV0hFUkUgbGVzaG96X2lkID0nICsgbGVzaG96Lmxlc2hvel9pZCwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgIGRvbmUoKVxuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChjb25zb2xlLmVycm9yKCdlcnJvciBoYXBwZW5lZCBkdXJpbmcgcXVlcnknLCBlcnIpKVxuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUocmVzdWx0LnJvd3MpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgKVxufVxuXG5cbi8vIGNvbnN0IGdldEJsb2NrTGlzdCA9IChmb3Jlc3RyeSkgPT4ge1xuLy8gICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuLy8gICAgIHBvb2wuY29ubmVjdChmdW5jdGlvbiAoZXJyLCBjbGllbnQsIGRvbmUpIHtcbi8vICAgICAgIGlmIChlcnIpIHtcbi8vICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIGZldGNoaW5nIGNsaWVudCBmcm9tIHBvb2wnLCBlcnIpXG4vLyAgICAgICB9XG4vLyAgICAgICBjbGllbnQucXVlcnkoJ1NFTEVDVCBnaWQsIGJsb2NrX251bSwgZm9yZXN0cnlfaWQgRlJPTSBmb3Jlc3QuYmxvY2sgV0hFUkUgZm9yZXN0cnlfaWQgPScgKyBmb3Jlc3RyeS5naWQsIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuLy8gICAgICAgICBkb25lKClcbi8vICAgICAgICAgaWYgKGVycikge1xuLy8gICAgICAgICAgIHJldHVybiByZWplY3QoY29uc29sZS5lcnJvcignZXJyb3IgaGFwcGVuZWQgZHVyaW5nIHF1ZXJ5JywgZXJyKSlcbi8vICAgICAgICAgfVxuLy8gICAgICAgICByZXNvbHZlKHJlc3VsdC5yb3dzKVxuLy8gICAgICAgfSlcbi8vICAgICB9KVxuLy8gICB9XG4vLyAgIClcbi8vIH1cblxuXG4vLyBjb25zdCBnZXRTdGFuZExpc3QgPSAoYmxvY2spID0+IHtcbi8vICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbi8vICAgICBwb29sLmNvbm5lY3QoZnVuY3Rpb24gKGVyciwgY2xpZW50LCBkb25lKSB7XG4vLyAgICAgICBpZiAoZXJyKSB7XG4vLyAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKCdlcnJvciBmZXRjaGluZyBjbGllbnQgZnJvbSBwb29sJywgZXJyKVxuLy8gICAgICAgfVxuLy8gICAgICAgY2xpZW50LnF1ZXJ5KCdTRUxFQ1QgZ2lkLCBsZXNob3pfbnVtLCBibG9ja19udW0sIGZvcmVzdHJ5X251bSwgc3RhbmRfbnVtIEZST00gZm9yZXN0LnN0YW5kIFdIRVJFIGJsb2NrX2lkID0nICsgYmxvY2suZ2lkLCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbi8vICAgICAgICAgZG9uZSgpXG4vLyAgICAgICAgIGlmIChlcnIpIHtcbi8vICAgICAgICAgICByZXR1cm4gcmVqZWN0KGNvbnNvbGUuZXJyb3IoJ2Vycm9yIGhhcHBlbmVkIGR1cmluZyBxdWVyeScsIGVycikpXG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgcmVzb2x2ZShyZXN1bHQucm93cylcbi8vICAgICAgIH0pXG4vLyAgICAgfSlcbi8vICAgfVxuLy8gICApXG4vLyB9Il19