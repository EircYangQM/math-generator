<template>
  <v-container>
    <v-row class="text-right pa-4 d-print-none">
      <v-btn @click="print" color="primary" class="no-print">Print Pages</v-btn>
      <v-btn @click="genProblems()" color="primary" class="no-print">
        Generate
      </v-btn>
      <v-btn icon color="primary" @click.stop="drawer = !drawer">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-row>
    <div
      v-for="(page, pageIdx) in expressions"
      :key="pageIdx"
      :class="pageIdx < expressions.length - 1 ? 'break-after' : ''"
    >
      <v-row v-for="(row, rowIdx) in page" :key="rowIdx" class="text-center">
        <v-col
          v-for="(expr, itemIdx) in row"
          :key="itemIdx"
          :cols="12 / row.length"
        >
          {{ expr }}
        </v-col>
      </v-row>
    </div>
    <v-navigation-drawer class="d-print-none" v-model="drawer" absolute right>
      <v-list nav dense>
        <v-list-item-group active-class="deep-purple--text text--accent-4">
          <v-list-item>
            <div class="h2">Settings</div>
          </v-list-item>

          <v-select
            v-model="selectedOptions"
            item-text="text"
            item-value="value"
            :items="operators"
            label="Operators"
            multiple
            outlined
          ></v-select>

          <v-select
            v-model="genOptions.hasDecimal"
            item-text="text"
            item-value="value"
            :items="trueFalse"
            label="Has Decimal"
            outlined
          ></v-select>

          <v-select
            v-model="genOptions.hasNegative"
            item-text="text"
            item-value="value"
            :items="trueFalse"
            label="Has Negative"
            outlined
          ></v-select>

          <v-text-field
            v-model="genOptions.numCount"
            type="number"
            label="Number Count"
            outlined
          ></v-text-field>
          <v-list-item>
            <div class="h2">Page</div>
          </v-list-item>
          <v-text-field
            v-model="pageOptions.pageCount"
            type="number"
            label="Page Count"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="pageOptions.perPage"
            type="number"
            label="Rows in Page"
            outlined
          ></v-text-field>

          <v-select
            v-model="pageOptions.perRow"
            :items="exprInRows"
            label="Expression in Row"
            outlined
          ></v-select>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
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
      },
      pageOptions: {
        perPage: 12, // Line Count
        perRow: 3, // Expression Count in Line
        pageCount: 2, // Page Count
      },
      expressions: [],
      drawer: "",
      operators: [
        { value: PLUS, text: "+" },
        { value: MINUS, text: "-" },
        { value: MUTLI, text: "*" },
        { value: DIVID, text: "/" },
      ],
      trueFalse: [
        { value: true, text: "True" },
        { value: false, text: "False" },
      ],
      exprInRows: [2, 3, 4, 6],
      selectedOptions: [PLUS, MINUS],
    };
  },
  mounted() {
    // this.genProblems();
  },
  methods: {
    async print() {
      window.print();
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
      let expr = "";
      let retVal = "";
      while (retVal == "") {
        expr = this.getExpr(this.genOptions);
        var val = eval(expr);
        if (val < 0) {
          if (!this.genOptions.hasNegative) {
            continue;
          }
        }

        retVal = val;
      }

      // return expr + "=" + val;
      return expr + "=" + val;
    },
    getExpr(options) {
      let num1 = this.genNum(options.numCount, options.hasDecimal);
      let num2 = this.genNum(options.numCount, options.hasDecimal);
      let operator = this.genOperator(options.operator);
      return num1 + operator + num2;
    },
    genOperator(operator) {
      let retVal = "";
      if (operator == 0) return "";
      while (retVal == "") {
        let r = this.getRandomInt(1, 4);
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
  },
};
</script>
