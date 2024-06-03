// allows JSON.stringify() to serialize a BigInt

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };