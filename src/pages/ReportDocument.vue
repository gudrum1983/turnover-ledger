<script setup lang="ts"></script>

<template>
  <div class="ReportDocument">
    <div class="1">
      <div><h2 class="mt-0">Obrazac KPO</h2></div>
      <div>
        <p><strong>PIB:</strong> 123</p>
        <p><strong>Obveznik:</strong> 123</p>
        <p><strong>Firma-radnja:</strong> 123</p>
        <p><strong>Sedište:</strong> 123</p>
        <p><strong>Šifra poreskog obveznika:</strong> 123</p>
        <p><strong>Šifra delatnosti:</strong> 13</p>
      </div>
      <div class="mt-10">
        <table class="w-full border-collapse border border-slate-800">
          <thead>
            <tr>
              <th class="border border-slate-500">Redni broj <small class="block">(1)</small></th>
              <th class="border border-slate-500">Datum i opis knjiženja <small class="block">(2)</small></th>
              <th class="border border-slate-500">
                <table class="w-full">
                  <tr>
                    <th class="w-full border-b border-slate-500 pb-5" colspan="2">PRIHOD OD DELATNOSTI</th>
                  </tr>
                  <tr>
                    <th class="border-r border-slate-500 w-1/2 pb-5">
                      od prodaje proizvoda <small class="block">(3)</small>
                    </th>
                    <th class="w-1/2 pb-5">od izvršenih usluga <small class="block">(4)</small></th>
                  </tr>
                </table>
              </th>
              <th class="border border-slate-500">SVEGA PRIHODI OD DELATNOSTI <small class="block">(3 + 4)</small></th>
            </tr>
          </thead>
          <tbody>
            <tr class="group">
              <td class="border border-slate-500 text-center pb-3">1</td>
              <td class="border border-slate-500 pb-3"><p class="text-center">01/01/01</p></td>
              <td class="border border-slate-500">
                <table class="w-full">
                  <tr>
                    <td class="border-r border-slate-500 w-1/2 pb-3"><p class="text-center">4,00</p></td>
                    <td class="w-1/2 pb-3"><p class="text-center">5,00</p></td>
                  </tr>
                </table>
              </td>
              <td class="border border-slate-500 relative text-center pb-3">
                <span>9,00</span>
                <button
                  type="button"
                  class="absolute top-0 right-0 md:hidden group-hover:block group-hover:ease-out group-hover:duration-900"
                >
                  <svg
                    class="w-6 h-6 fill-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
                    ></path>
                  </svg>
                </button>
              </td>
            </tr>
            <tr class="group">
              <td class="border border-slate-500 text-center pb-3">2</td>
              <td class="border border-slate-500 pb-3"><p class="text-center">02/02/02</p></td>
              <td class="border border-slate-500">
                <table class="w-full">
                  <tr>
                    <td class="border-r border-slate-500 w-1/2 pb-3"><p class="text-center">4,00</p></td>
                    <td class="w-1/2 pb-3"><p class="text-center">4,00</p></td>
                  </tr>
                </table>
              </td>
              <td class="border border-slate-500 relative text-center pb-3">
                <span>8,00</span>
                <button
                  type="button"
                  class="absolute top-0 right-0 md:hidden group-hover:block group-hover:ease-out group-hover:duration-900"
                >
                  <svg
                    class="w-6 h-6 fill-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
                    ></path>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-between mt-10">
        <div>
          <p>Sastavio</p>
          <p class="border-b border-black pb-2 min-w-[250px]">123</p>
        </div>
        <div>
          <p>Odgovorno lice</p>
          <p class="border-b border-black pb-2 min-w-[250px]">123</p>
        </div>
      </div>
    </div>
    <div>
      <p class="wyq080---odsek"><a name="str_23"></a> KPO*</p>
      <p class="normal"><b>PIB</b> ________________________________________</p>
      <p class="normal">
        <b>Obveznik</b> ___________________________________<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
        &nbsp;&nbsp;(ime i prezime poreskog obveznika)
      </p>
      <p class="normal"><b>Firma - radnje</b> ______________________________</p>
      <p class="normal">
        <b>Sedište</b> ______________________________________<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        (adresa)
      </p>
      <p class="normal"><b>Šifra poreskog obveznika</b> ______________________</p>
      <p class="normal"><b>Šifra delatnosti</b> _______________________________</p>
      <p class="wyq080---odsek">
        <a name="str_24"></a> KNJIGA O OSTVARENOM PROMETU <br />
        PAUŠALNO OPOREZOVANIH OBVEZNIKA
      </p>
      <p class="normalprored">&nbsp;</p>
      <table cellspacing="0" border="1">
        <tr>
          <td rowspan="2" colspan="1">
            <p class="normal" align="center">
              Redni<br />
              broj
            </p>
          </td>
          <td rowspan="2" colspan="1">
            <p class="normal" align="center">Datum i opis knjiženja</p>
          </td>
          <td rowspan="1" colspan="2">
            <p class="normal" align="center">PRIHOD OD DELATNOSTI</p>
          </td>
          <td rowspan="2" colspan="1">
            <p class="normal" align="center">
              SVEGA <br />
              PRIHODI OD <br />
              DELATNOSTI <br />
              (3 + 4)
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="normal" align="center">od prodaje proizvoda</p>
          </td>
          <td>
            <p class="normal" align="center">od izvršenih usluga</p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="normal" align="center">1</p>
          </td>
          <td>
            <p class="normal" align="center">2</p>
          </td>
          <td>
            <p class="normal" align="center">3</p>
          </td>
          <td>
            <p class="normal" align="center">4</p>
          </td>
          <td>
            <p class="normal" align="center">5</p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
          <td>
            <p class="normal">&nbsp;</p>
          </td>
        </tr>
      </table>
      <p class="normal">&nbsp;</p>
      <table class="tbezokvira" cellspacing="0">
        <tr>
          <td width="32%">
            <p class="normal" align="center">Sastavio</p>
          </td>
          <td width="33%">
            <p class="normal">&nbsp;</p>
          </td>
          <td width="35%">
            <p class="normal" align="center">Odgovorno lice</p>
          </td>
        </tr>
        <tr>
          <td width="32%">
            <p class="normal" align="center">______________________________</p>
          </td>
          <td width="33%">
            <p class="normal">&nbsp;</p>
          </td>
          <td width="35%">
            <p class="normal" align="center">_______________________________</p>
          </td>
        </tr>
      </table>
      <p class="normal">&nbsp;</p>
    </div>

    <div>
      <!--OBRASCI SADRZAJ-->
      <div class="col-sm-8" id="main">
        <h1>Obrazac KPO - KNJIGA O OSTVARENOM PROMETU PAUŠALNO OPOREZOVANIH OBVEZNIKA</h1>
        <br />

        <div class="container">
          <table class="" style="width: 50%">
            <tbody>
              <tr>
                <td>PIB</td>
                <td>______________________________</td>
              </tr>
              <tr>
                <td>Obveznik</td>
                <td>______________________________</td>
              </tr>
              <tr>
                <td>Firma-radnje</td>
                <td>______________________________</td>
              </tr>
              <tr>
                <td></td>
                <td>(ime i prezime poreskog obveznika)</td>
              </tr>
              <tr>
                <td>Sedište</td>
                <td>______________________________</td>
              </tr>
              <tr>
                <td>Šifra poreskog obveznika</td>
                <td>______________________________</td>
              </tr>
              <tr>
                <td>Šifra delatnosti</td>
                <td>______________________________</td>
              </tr>
            </tbody>
          </table>

          <div class="table-responsive text-center">
            <table class="table table-bordered text-center">
              <thead>
                <tr>
                  <th class="text-center">Redni broj</th>
                  <th class="text-center">Datum i opis knjiženja</th>
                  <th class="text-center" colspan="2">PRIHOD OD DELATNOSTI</th>
                  <th class="text-center">SVEGA PRIHODI OD DELATNOSTI (3+4)</th>
                </tr>
                <tr>
                  <th class="text-center">1</th>
                  <th class="text-center">2</th>
                  <th class="text-center">Od prodaje Proizvoda</th>
                  <th class="text-center">Od izvršenih usluga</th>
                  <th class="text-center">5</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="clearfix"></div>
        <div class="row ml-0 pl-0">
          <div class="col-md-12 ml-0 pl-0">
            <div class="col-md-4 ml-0 pl-0">
              <p>Sastavio</p>
              <p>______________________________</p>
            </div>
            <div class="col-md-4"></div>
            <div class="col-md-4">
              <p>Odgovorno lice</p>
              <p>______________________________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ReportDocument {
  font-family: 'Open Sans', sans-serif !important;
}
table {
  display: table;
  box-sizing: border-box;
  text-indent: initial;
  unicode-bidi: isolate;
  border-color: gray;
  border-spacing: 0;
  border-collapse: collapse;
}

.table > tbody > tr > td,
.table > tbody > tr > th,
.table > tfoot > tr > td,
.table > tfoot > tr > th,
.table > thead > tr > td,
.table > thead > tr > th {
  padding: 8px;
  line-height: 1.42857143;
  vertical-align: top;
}

.table-bordered,
.table-bordered > tbody > tr > td,
.table-bordered > tbody > tr > th,
.table-bordered > tfoot > tr > td,
.table-bordered > tfoot > tr > th,
.table-bordered > thead > tr > td,
.table-bordered > thead > tr > th {
  border: 1px solid var(--color-border-default);
}

td {
  display: table-cell;
  vertical-align: inherit;
  unicode-bidi: isolate;
}
</style>
