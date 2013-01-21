var initData = {
  genes: {
    hpr: {
      desc: 'resistance to whitefly',
      alleles: { A: -1, a: 1, aw: 0.5 }
    }, 
    mecu: {
      desc: 'resistance to whitefly (hair)', 
      max: 3,
      alleles: {B: 1.5, b: 0}
    }, 
    acmv1: {
      desc: 'resistance to virus',
      alleles: {C: 2, c: 0}
    },
    acmv2: {
      desc: 'resistance to virus',
      max: 3,
      alleles: {D: -1.5, d: 1.5}
    },
    cyn: {
      desc: 'resistance to cyanide',
      max: 4,
      alleles: {E0: 2, E1: 1, E2: 0.5}
    },
    vitA: {
      desc: 'root color',
      alleles: {F: 1, f: 0}
    }
  }, 
  parents: {
    CD: {
      name: 'Cool Delicious',
      genes: {
        hpr: ['A', 'A'],
        mecu: ['b', 'b'],
        acmv1: ['c', 'c'],
        acmv2: ['D', 'D'],
        cyn: ['E2', 'E1'],
        vitA: ['f', 'f']
      },
      dmy: 4,
      branching: 1
    },
    BD: {
      name: "Bitter Delicious",
      genes: {
        hpr: ['A', 'A'],
        mecu: ['b', 'b'],
        acmv1: ['c', 'c'],
        acmv2: ['D', 'd'],
        cyn: ['E0', 'E1'],
        vitA: ['f', 'f']
      }, 
      dmy: 5,
      branching: 1          
    },
    HL: {
      name: "Hairy Leaf",
      genes: {
        hpr: ['A', 'a'],
        mecu: ['B', 'B'],
        acmv1: ['c', 'c'],
        acmv2: ['D', 'd'],
        cyn: ['E1', 'E1'],
        vitA: ['f', 'f']
      },
      dmy: 4,
      branching: 3
    },
    FA: {
      name: "Fly Away",
      genes: {
        hpr: ['a', 'a'],
        mecu: ['B', 'b'],
        acmv1: ['c', 'c'],
        acmv2: ['D', 'D'],
        cyn: ['E0', 'E1'],
        vitA: ['f', 'f']
      },
      dmy: 3,
      branching: 3
    },
    AV: {
      name: "Antiviral",
      genes: {
        hpr: ['A', 'a'],
        mecu: ['b', 'b'],
        acmv1: ['C', 'C'],
        acmv2: ['D', 'D'],
        cyn: ['E0', 'E2'],
        vitA: ['f', 'f']
      },
      dmy: 3,
      branching: 3
    }, 
    HH: {
      name: "Hale and Hearty",
      genes: {
        hpr: ['A', 'A'],
        mecu: ['B', 'b'],
        acmv1: ['c', 'c'],
        acmv2: ['d', 'd'],
        cyn: ['E1', 'E2'],
        vitA: ['F', 'f']
      },
      dmy: 3,
      branching: 2
    }, 
    MT: {
      name: "M.Tristis",
      genes: {
        hpr: ['aw', 'aw'],
        mecu: ['B', 'B'],
        acmv1: ['C', 'c'],
        acmv2: ['D', 'D'],
        cyn: ['E0', 'E0'],
        vitA: ['F', 'f']
      }, 
      dmy: 2,
      branching: 4
    }, 
    GC: {
      name: "Golden Cassava",
      genes: {
        hpr: ['a', 'a'],
        mecu: ['B', 'b'],
        acmv1: ['c', 'c'],
        acmv2: ['D', 'd'],
        cyn: ['E1', 'E1'],
        vitA: ['F', 'F']
      }, 
      dmy: 3,
      branching: 3
    }
  }
};

var genes = {};
_.each(initData.genes, function(gd, key){
  genes[key] = new Gene(key, gd);
});

var parents = {};
_.each(initData.parents, function(pd, key){
  parents[key] = new Plant(key, pd);
});

function Gene(name, opts){
  opts = opts || {};
  this.name = name;
  this.desc = opts.desc || {};
  this.alleles = opts.alleles || {};
  this.min = opts.min || 0;
  this.max = opts.max || 2;        
}

function Plant(id, opts){
  opts = opts || {};
  this.id = id;
  this.name = opts.name || '';
  this.genes = opts.genes || {};
  this.dmy = opts.dmy || 0;
  this.branching = opts.branching || 0;
  this.img = opts.img || id + '.png';
}

Plant.prototype.hairiness = function(){
  if (!this._hairiness) {
    var hairScore = this.geneScore(genes.mecu, this.genes.mecu);
    this._hairiness = hairScore === 0 ? "none" : (hairScore === 1.5) ? "moderate" : "high";
  }
  return this._hairiness;
}

Plant.prototype.rootColor = function() {
  if (!this._rootColor) {
    var rootScore = this.geneScore(genes.vitA, this.genes.vitA); 
    this._rootColor = rootScore === 0 ? "white" : (rootScore === 1) ? "yellow-white" : "yellow";
  }
  return this._rootColor;
}

Plant.prototype.geneScore = function(gene, alleles){
  var score = 0;
  _.each(alleles, function(allele){
    score += gene.alleles[allele];
  });
  
  if (score > gene.max) score = gene.max;
  if (score < gene.min) score = gene.min;
  return score;
}

Plant.prototype.flyResistance = function(){
  if (!this._flyResistance) {
    var cynValues = { E0: 1, E1: 0.5, E2: 0};
    var cynAddition = 0;          
    _.each(this.genes.cyn, function(cynAllele){
      cynAddition += cynValues[cynAllele];
    });          
    this._flyResistance = this.geneScore(genes.hpr, this.genes.hpr) + this.geneScore(genes.mecu, this.genes.mecu) + cynAddition;
  } 
  return this._flyResistance;
}

Plant.prototype.virusResistance = function(){
  if (!this._virusResistance) {
    this._virusResistance = this.geneScore(genes.acmv1, this.genes.acmv1) + this.geneScore(genes.acmv2, this.genes.acmv2);
  } 
  return this._virusResistance;
}

Plant.prototype.cyanide = function(){
  if (!this._cyanide){
    this._cyanide = this.geneScore(genes.cyn, this.genes.cyn);
  }
  return this._cyanide;
}

Plant.prototype.crossWith = function(plant2) {  
  var plant1 = this;      
  var possibles = {};        
  _.each(plant1.genes, function(p1Alleles, geneId) {          
    var p2Alleles = plant2.genes[geneId];          
    if (p2Alleles) {
      var combos = [];            
      for (var i = 0; i<p1Alleles.length; i++) {
        for (var j=0; j<p2Alleles.length; j++) {
          combos.push([p1Alleles[i], p2Alleles[j]]);
        }
      }
      possibles[geneId] = combos; 
    } else {
      possibles[geneId] = [p1Alleles];
    }
  });
    
  var offspring = [];
  var name = plant1.id + 'x' + plant2.id;
  _.times(8, function(n){          
        
    var genes = {};
    _.each(possibles, function(combos, geneId){
      var comboCount = combos.length;
      genes[geneId] = combos[Math.floor((Math.random()*comboCount))];
    });
    
    var plant = new Plant(name + '-' + (n+1), {
      name: name,
      genes: genes,
      img: 'seedling.png'
    });          
    
    // cross the fake genes    
    plant.dmy = plant.fakeCross(plant1.dmy, plant2.dmy);
    plant.branching = plant.fakeCross(plant1.branching, plant2.branching);
    
    offspring.push(plant);
  });
  
  return offspring;
}

Plant.prototype.fakeCross = function(val1, val2) {
  var val = (val1 + val2)/2;
  var mutation = [-0.5, 0, 0, 0, 0.5];
  return val + mutation[Math.floor(Math.random()*mutation.length)];;
}

