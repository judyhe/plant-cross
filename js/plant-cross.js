var initData = {
  genes: {
    hpr: {
      desc: 'resistance to whitefly',
      alleles: { A: -1, a: 1, aw: 0.49 },
      rounding: true
    }, 
    mecu: {
      desc: 'resistance to whitefly (hair)', 
      max: 3,
      alleles: {B: 1, b: 0}
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
      cost: 100,
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
      cost: 100,
      genes: {
        hpr: ['A', 'A'],
        mecu: ['b', 'b'],
        acmv1: ['c', 'c'],
        acmv2: ['D', 'D'],
        cyn: ['E0', 'E1'],
        vitA: ['f', 'f']
      }, 
      dmy: 5,
      branching: 1          
    },
    HL: {
      name: "Hairy Leaf",
      cost: 200,
      genes: {
        hpr: ['A', 'A'],
        mecu: ['B', 'B'],
        acmv1: ['c', 'c'],
        acmv2: ['D', 'd'],
        cyn: ['E1', 'E1'],
        vitA: ['f', 'f']
      },
      dmy: 2,
      branching: 3
    },
    FA: {
      name: "Fly Away",
      cost: 250,
      genes: {
        hpr: ['a', 'a'],
        mecu: ['B', 'b'],
        acmv1: ['c', 'c'],
        acmv2: ['D', 'D'],
        cyn: ['E0', 'E1'],
        vitA: ['f', 'f']
      },
      dmy: 3,
      branching: 4
    },
    AV: {
      name: "Antiviral",
      cost: 300,
      genes: {
        hpr: ['A', 'A'],
        mecu: ['b', 'b'],
        acmv1: ['C', 'c'],
        acmv2: ['D', 'D'],
        cyn: ['E0', 'E2'],
        vitA: ['f', 'f']
      },
      dmy: 2,
      branching: 3
    }, 
    HH: {
      name: "Hale and Hearty",
      cost: 350,
      genes: {
        hpr: ['A', 'A'],
        mecu: ['B', 'b'],
        acmv1: ['c', 'c'],
        acmv2: ['d', 'd'],
        cyn: ['E1', 'E2'],
        vitA: ['F', 'f']
      },
      dmy: 2,
      branching: 2
    }, 
    MT: {
      name: "M.Tristis",
      cost: 50,
      genes: {
        hpr: ['aw', 'aw'],
        mecu: ['B', 'B'],
        acmv1: ['C', 'C'],
        acmv2: ['D', 'D'],
        cyn: ['E0', 'E0'],
        vitA: ['F', 'f']
      }, 
      dmy: 1,
      branching: 4
    }, 
    GC: {
      name: "Golden Cassava",
      cost: 400,
      genes: {
        hpr: ['a', 'a'],
        mecu: ['B', 'b'],
        acmv1: ['c', 'c'],
        acmv2: ['D', 'D'],
        cyn: ['E1', 'E1'],
        vitA: ['F', 'F']
      }, 
      dmy: 3,
      branching: 2
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
  this.rounding = opts.rounding;     
}

function Plant(id, opts){
  opts = opts || {};
  this.id = id;
  this.name = opts.name || '';
  this.genes = opts.genes || {};
  this.dmy = opts.dmy || 0;
  this.branching = opts.branching || 0;
  this.img = opts.img || id + '.png';
  this.offspring = opts.offspring || false;
  this.generation = opts.generation || 0;
  this.cost = opts.cost || 0;
  this.rootParents = opts.rootParents || [id];
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
  
  if (gene.rounding) {
    score = Math.round(score);
  }
  
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
  var generation = _.max([plant1.generation, plant2.generation]) + 1;
  var cost = 1000;

  if (plant1.generation === 0 && plant2.generation === 0) {
    cost += plant1.cost;
    cost += plant2.cost;    
  } else if (plant1.generation === 0){
    cost += plant2.cost;
    // check if plant2 already has plant1.id in its rootParents
    if (!_.contains(plant2.rootParents, plant1.id)) {
      cost += plant1.cost;
    }     
  } else if (plant2.generation === 0) {
    cost += plant1.cost;
    // check if plant1 already has plant2.id in its rootParents
    if (!_.contains(plant1.rootParents, plant2.id)) {
      cost += plant2.cost;
    }    
  } else {
    cost += _.max([plant1.cost, plant2.cost]);
  }
  
  var offspringRootParents = _.union(plant1.rootParents, plant2.rootParents);
  
  var offspring = [];
  _.times(8, function(n){          
        
    var genes = {};
    _.each(possibles, function(combos, geneId){
      var comboCount = combos.length;
      genes[geneId] = combos[Math.floor((Math.random()*comboCount))];
    });
        
    var id = plant1.id + 'x' + plant2.id + '-' + (n+1);
    var name = generation + '-' + (n+1);
    
    var plant = new Plant(id, {
      name: name,
      genes: genes,
      img: 'seedling.png',
      offspring: true,
      generation: generation,
      cost: cost,
      rootParents: offspringRootParents
    });          
    
    // cross the fake genes    
    plant.dmy = plant.fakeCross(plant1.dmy, plant2.dmy);
    plant.branching = plant.fakeCross(plant1.branching, plant2.branching);
    
    offspring.push(plant);
  });
  
  return offspring;
}

Plant.prototype.fakeCross = function(val1, val2) {
  var val = Math.round(val1 + val2)/2;
  var mutation = [-0.5, 0, 0, 0, 0.5];  
  val += mutation[Math.floor(Math.random()*mutation.length)];
  if (val < 1) return 1;
  if (val > 5) return 5;
  return val;
}

