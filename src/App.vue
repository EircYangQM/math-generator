<template>
  <v-app id="inspire">
    <v-app-bar app color="grey lighten-3 d-print-none" flat>
      <v-container class="py-0 fill-height">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer">
          <v-icon>mdi-cog</v-icon>
        </v-app-bar-nav-icon>
        <v-toolbar-title>{{ $t("title") }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="grey lighten-3" v-bind="attrs" v-on="on">
              <v-icon left> mdi-web </v-icon>
              {{ selectedLanguage }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in langauges" :key="index">
              <v-list-item-title @click="selectLanguage(item)">{{
                item.text
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-container>
    </v-app-bar>
    <v-navigation-drawer
      class="d-print-none"
      v-model="drawer"
      absolute
      bottom
      temporary
    >
      <v-list nav dense>
        <v-list-item-group active-class="deep-purple--text text--accent-4">
          <v-list-item>
            <div class="h2">{{ $t("setting") }}</div>
          </v-list-item>

          <v-select
            v-model="selectedOptions"
            item-text="text"
            item-value="value"
            :items="operators"
            :label="$t('operators')"
            multiple
            outlined
          ></v-select>

          <v-select
            v-model="genOptions.hasDecimal"
            item-text="text"
            item-value="value"
            :items="trueFalse"
            :label="$t('hasDeciaml')"
            outlined
          ></v-select>

          <v-select
            v-model="genOptions.hasNegative"
            item-text="text"
            item-value="value"
            :items="trueFalse"
            :label="$t('hasNegative')"
            outlined
          ></v-select>

          <v-select
            :items="[1, 2, 3]"
            type="number"
            v-model="genOptions.opCount"
            :label="$t('opCount')"
            outlined
          ></v-select>

          <v-text-field
            v-model="genOptions.numCount"
            type="number"
            :label="$t('numCount')"
            outlined
          ></v-text-field>

          <v-list-item>
            <div class="h2">{{ $t("page") }}</div>
          </v-list-item>

          <v-text-field
            v-model="pageOptions.pageCount"
            type="number"
            :label="$t('pageCount')"
            outlined
          ></v-text-field>

          <v-text-field
            v-model="pageOptions.perPage"
            type="number"
            :label="$t('prePage')"
            outlined
          ></v-text-field>

          <v-select
            v-model="pageOptions.perRow"
            :items="exprInRows"
            :label="$t('preRow')"
            outlined
          ></v-select>

          <v-row align="center" justify="space-around">
            <v-btn @click="closeDraw()" color="primary" class="no-print">
              {{ $t("generate") }}
            </v-btn>
          </v-row>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container>
        <v-row class="text-right pa-4 d-print-none justify-end">
          <v-btn @click="print" color="primary" class="no-print mr-4">
            <v-icon left> mdi-printer </v-icon>
            {{ $t("print") }}
          </v-btn>
          <v-btn @click="genProblems()" color="primary" class="no-print">
            <v-icon left> mdi-file-document </v-icon>
            {{ $t("generate") }}
          </v-btn>
        </v-row>
        <div
          v-for="(page, pageIdx) in expressions"
          :key="pageIdx"
          :class="pageIdx < expressions.length - 1 ? 'break-after' : ''"
        >
          <v-row
            v-for="(row, rowIdx) in page"
            :key="rowIdx"
            class="text-center"
          >
            <v-col
              v-for="(expr, itemIdx) in row"
              :key="itemIdx"
              :cols="12 / row.length"
              class="text-left"
            >
              <div class="text-h5 pl-4 pr-4 pt-2 pb-2">{{ expr }}</div>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
const PLUS = 0x01;
const MINUS = 0x02;
const MUTLI = 0x04;
const DIVID = 0x08;
export default {
  name: "MathCalcProblem",
  data() {
    return {
      genOptions: {
        numCount: 2,
        hasDecimal: false,
        operator: PLUS + MINUS + MUTLI + DIVID,
        hasNegative: false,
        opCount: 1,
      },
      pageOptions: {
        perPage: 12, // Line Count
        perRow: 3, // Expression Count in Line
        pageCount: 2, // Page Count
      },
      expressions: [],
      drawer: true,
      operators: [
        { value: PLUS, text: "+" },
        { value: MINUS, text: "-" },
        { value: MUTLI, text: "*" },
        { value: DIVID, text: "/" },
      ],
      trueFalse: [
        { value: true, text: this.$t("txtTrue") },
        { value: false, text: this.$t("txtFalse") },
      ],
      exprInRows: [2, 3, 4, 6],
      selectedOptions: [PLUS, MINUS],
      langauges: [
        { value: "en", text: "English" },
        { value: "cn", text: "中文" },
      ],
      selectedLanguage: "中文",
    };
  },
  mounted() {
    // this.genProblems();
    this.genOptions = this.getGenOptions;
    this.pageOptions = this.getPageOptions;
  },
  computed: {
    ...mapGetters({
      getGenOptions: "getGenOptions",
      getPageOptions: "getPageOptions",
    }),
  },
  methods: {
    async print() {
      window.print();
    },
    selectLanguage(item) {
      this.selectedLanguage = item.text;
      this.$root.$i18n.locale = item.value;
    },
    closeDraw() {
      this.drawer = false;
      this.setGenOptions(this.genOptions);
      this.setPageOptions(this.pageOptions);
      this.genProblems();
    },
    genProblems() {
      this.genOptions.operator = 0;
      this.selectedOptions.forEach((element) => {
        this.genOptions.operator += element;
      });
      this.expressions = [];
      for (let pageIdx = 0; pageIdx < this.pageOptions.pageCount; pageIdx++) {
        let page = [];
        for (let rowIdx = 0; rowIdx < this.pageOptions.perPage; rowIdx++) {
          let exps = [];
          for (let exprIdx = 0; exprIdx < this.pageOptions.perRow; exprIdx++) {
            let expr = this.genProblem();
            exps.push(expr);
          }
          page.push(exps);
        }
        this.expressions.push(page);
      }
    },
    genProblem() {
      let expr = this.genProblemImpl();
      while (expr == null) {
        expr = this.genProblemImpl();
      }

      return expr;
    },
    genProblemImpl() {
      let isFinished = false;
      let preNum = null;
      let lastOpCount = this.genOptions.opCount;
      let exprs = [];
      let tryCount = 10;
      while (!isFinished) {
        let expr = this.getExpr(this.genOptions, preNum);
        var val = eval(expr[0] + expr[1] + expr[2]);
        if (val < 0) {
          if (tryCount <= 0) {
            isFinished = true;
            exprs = null;
            break;
          }
          if (!this.genOptions.hasNegative) {
            tryCount--;
            continue;
          }
        }

        if (Math.floor(val) != val) {
          if (tryCount <= 0) {
            isFinished = true;
            exprs = null;
            break;
          }
          if (!this.genOptions.hasDecimal) {
            tryCount--;
            continue;
          }
        }

        if (preNum == null) {
          exprs.push(expr[0]);
        }
        exprs.push(expr[1]);
        exprs.push(expr[2]);
        preNum = val;
        lastOpCount--;
        if (lastOpCount <= 0) {
          isFinished = true;
          break;
        }
      }

      if (exprs == null) {
        return null;
      } else {
        let retVal = "";
        let length = exprs.length;
        let quoteCount = 0;
        let quotas = new Array(quoteCount).fill(false);
        let isMultiOrDiv = false;
        for (let index = (length - 1) / 2 - 1; index >= 0; index--) {
          let op = exprs[1 + index * 2];
          if (op == "*" || op == "/") {
            isMultiOrDiv = true;
          } else {
            if (isMultiOrDiv) {
              quotas[index] = true;
              quoteCount++;
            }
          }
        }
        exprs.forEach((e, index) => {
          if (index == 0) {
            for (let index = 0; index < quoteCount; index++) {
              retVal += "(";
            }
          }
          if (index >= 3 && index % 2 == 1 && quotas[(index - 1) / 2 - 1]) {
            retVal += ")";
          }
          retVal += e;
        });
        return retVal + "=";
      }
    },
    getExpr(options, preNum) {
      let num1 = preNum;
      if (preNum == null) {
        num1 = this.genNum(options.numCount, options.hasDecimal);
      }
      let num2 = this.genNum(options.numCount, options.hasDecimal);
      let operator = this.genOperator(options.operator);
      return [num1, operator, num2];
    },
    genOperator(operator) {
      let retVal = "";
      if (operator == 0) return "";
      while (retVal == "") {
        let r = this.getRandomInt(0, 4);
        let op = Math.pow(2, r);
        switch (op) {
          case PLUS:
            if ((PLUS & operator) == 0) continue;
            retVal = "+";
            break;
          case MINUS:
            if ((MINUS & operator) == 0) continue;
            retVal = "-";
            break;
          case MUTLI:
            if ((MUTLI & operator) == 0) continue;
            retVal = "*";
            break;
          case DIVID:
            if ((DIVID & operator) == 0) continue;
            retVal = "/";
            break;
          default:
            retVal = "";
            break;
        }
      }

      return retVal;
    },
    genNum(numCount, hasDecimal) {
      let min = Math.pow(10, numCount - 1);
      let max = Math.pow(10, numCount);
      let num = this.getRandomInt(min, max);
      if (hasDecimal) {
        num += this.getRandomInt(min, max) / Math.pow(10, numCount);
      }
      return num;
    },
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    },
    ...mapMutations(["setGenOptions", "setPageOptions"]),
  },
};
</script>

<i18n>
{
  "en": {
    "print": "Print",
    "generate": "Generate",
    "title": "Generate Math Problem",
    "setting": "Setting",
    "operators": "Operators",
    "hasDeciaml": "Has Decimal",
    "hasNegative": "Has Negative",
    "opCount": "Operator Count",
    "numCount": "Number Count",
    "page": "Page Setting",
    "pageCount": "Page Count",
    "prePage": "Rows in Page",
    "preRow": "Expression in Row",
    "txtTrue": "True",
    "txtFalse": "False"
  },
  "cn":{
    "print": "打印",
    "generate": "生成",
    "title": "生成数学题",
    "setting": "设置",
    "operators": "操作符号",
    "hasDeciaml": "含有小数",
    "hasNegative": "含有负数",
    "opCount": "符号个数",
    "numCount": "数字个数",
    "page": "页面设置",
    "pageCount": "页数",
    "prePage": "行数",
    "preRow": "每行",
    "txtTrue": "是",
    "txtFalse": "否"
  }
}
</i18n>
