import {expect} from 'chai';
import {typedPath as tp, typedPath} from './index';

const sym = Symbol("SomeSymbol");

type TestType = {
    a: {
        testFunc: () => { result: string },
        b: {
            arrayOfArrays: string[][]
            c: number;
            f: { test: string, blah: { path?: string }, arr: string[] }[];
        }
        [sym]: {
            g: string,
        }
    }
};

describe('Typed path', () => {
    it('should get field path', () => {
        expect(tp<TestType>().a.b.c.$).to.equal('c');
        expect(typedPath<TestType>().a.b.c.$path).to.equal('a.b.c');
        expect(typedPath<TestType>().a.b.c.$raw).to.deep.equal(['a', 'b', 'c']);
    });

    it('should get index path', () => {
        expect(tp<TestType>().a.b.f[3].$).to.equal('3');
        expect(tp<TestType>().a.b.f[3].arr[3].$).to.equal('3');
        expect(tp<TestType>().a.b.f[3].blah.path.$).to.equal('path');
        expect(tp<TestType>().a.b.f[3].$path).to.equal('a.b.f[3]');
        expect(tp<TestType>().a.b.f[3].$raw).to.deep.equal(['a', 'b', 'f', "3"]);
    });

    it('should get index of index for array of array ', () => {
        expect(tp<TestType>().a.b.arrayOfArrays[3].$).to.equal('3');
        expect(tp<TestType>().a.b.arrayOfArrays[3][4].$).to.equal('4');
        expect(tp<TestType>().a.b.arrayOfArrays[3][3].$path).to.equal('a.b.arrayOfArrays[3][3]');
        expect(tp<TestType>().a.b.arrayOfArrays[3][3].$raw).to.deep.equal(['a', 'b', 'arrayOfArrays', "3", "3"]);
    });

    it('should get array node', () => {
        expect(tp<TestType>().a.b.f.$).to.equal('f');
        expect(tp<TestType>().a.b.f.$path).to.equal('a.b.f');
        expect(tp<TestType>().a.b.f.$raw).to.deep.equal(['a', 'b', 'f']);
    });

    it('should get function return type path', () => {
        expect(tp<TestType>().a.testFunc.result.$).to.equal('result');
        expect(tp<TestType>().a.testFunc.result.$path).to.equal('a.testFunc.result');
        expect(tp<TestType>().a.testFunc.result.$raw).to.deep.equal(['a', 'testFunc', 'result']);
    });

    it('should get function path', () => {
        expect(tp<TestType>().a.testFunc.$).to.equal('testFunc');
        expect(tp<TestType>().a.testFunc.$path).to.equal('a.testFunc');
        expect(tp<TestType>().a.testFunc.$raw).to.deep.equal(['a', 'testFunc']);
    });

    it('should get path with symbol', () => {
        expect(tp<TestType>().a[sym].g.$).to.equal('g');
        expect(tp<TestType>().a[sym].$.toString()).to.equal(sym.toString());
        expect(tp<TestType>().a[sym].g.$path).to.equal('a.Symbol(SomeSymbol).g');
        expect(tp<TestType>().a[sym].g.$raw).to.deep.equal(['a', 'Symbol(SomeSymbol)', 'g']);
    });

    it('should get path for toString()', () => {
        expect(tp<TestType>().a.b.f[3].blah.path.toString()).to.equal('a.b.f[3].blah.path');
    });

    it('should get path for valueOf()', () => {
        expect(tp<TestType>().a.b.f[3].blah.path.valueOf()).to.equal('a.b.f[3].blah.path');
    });
});
