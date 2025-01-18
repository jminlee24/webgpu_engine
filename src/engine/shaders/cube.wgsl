struct Uniforms{
  viewProjection : mat4x4f,
};

struct VSOutput{
  @builtin(position) position : vec4f,
  @location(0) texCoord : vec2f,
  @location(1) normal: vec3f,
};

@group(0) @binding(0) var<uniform> uniforms : Uniforms;
@group(0) @binding(1) var ourSampler: sampler;
@group(0) @binding(2) var ourTexture: texture_2d<f32>;

@vertex fn vs(
  @location(0) position : vec3f,
  @location(1) normal: vec3f,
  @location(2) uv: vec2f
) -> VSOutput {

  var vsout : VSOutput;

  vsout.position = uniforms.viewProjection * vec4f(position.xyz, 1.0);

  vsout.texCoord = uv;
  vsout.normal = normal; 

  return vsout;
}

@fragment fn fs(
vs : VSOutput
) -> @location(0) vec4f {

  var normal = normalize(abs(vs.normal));

  return textureSample(ourTexture, ourSampler, vs.texCoord);
}
