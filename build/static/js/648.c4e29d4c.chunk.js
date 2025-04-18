'use strict';
(self.webpackChunktomoclub = self.webpackChunktomoclub || []).push([
  [648],
  {
    83648: function (t, a, e) {
      e.r(a);
      var s = e(29439),
        o = e(72791),
        n = e(38399),
        c = e(2631),
        d = e(98966),
        u = e(80184);
      a.default = function () {
        var t,
          a = (0, o.useState)(!1),
          e = (0, s.Z)(a, 2),
          l = e[0],
          r = e[1],
          i = (0, o.useState)({}),
          h = (0, s.Z)(i, 2),
          f = h[0],
          C = h[1],
          m = null === (t = JSON.parse((0, c.G)('user'))) || void 0 === t ? void 0 : t.displayName;
        return (
          (0, o.useEffect)(function () {
            r(!0),
              (0, c.F)(
                'get',
                'https://fb7si6b8qh.execute-api.us-east-1.amazonaws.com/testing/dashboardcountdata'
              )
                .then(function (t) {
                  C(t), r(!1);
                })
                .catch(function (t) {
                  console.log(t), r(!1);
                });
          }, []),
          (0, u.jsx)(u.Fragment, {
            children: l
              ? (0, u.jsx)(d.Z, {})
              : (0, u.jsx)('div', {
                  className: 'homeContent-container',
                  children: (0, u.jsx)(n.Z, {
                    title: 'Hello ' + m + ' !',
                    addCard1: 'Total Student',
                    addCard2: 'Total Teacher',
                    addCard3: 'Total School',
                    statsCard1: '123+',
                    statsCard2: '6.35',
                    statsCard3: '78%',
                    schoolData: f
                  })
                })
          })
        );
      };
    }
  }
]);
//# sourceMappingURL=648.c4e29d4c.chunk.js.map
