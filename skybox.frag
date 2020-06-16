precision mediump float;
uniform samplerCube cubeMap;
varying vec3 vTexCoords;

void main() {
 vec3 tc = vec3(vTexCoords.x, -vTexCoords.y, vTexCoords.z);
 gl_FragColor = textureCube(cubeMap, normalize(tc));
} 