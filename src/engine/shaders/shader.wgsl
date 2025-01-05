struct Uniforms{
  viewProjection : mat4x4f,
};

struct VSOutput{
  @builtin(position) position : vec4f,
  @location(0) texCoord : vec2f,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex fn vs(
@location(0) position : vec3f
) -> VSOutput {

  var vsout : VSOutput;
  var viewProjection = mat4x4<f32>(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0,
  );

  vsout.position = uniforms.viewProjection * vec4f(position.xyz, 1.0);

  vsout.texCoord = position.xy;

  return vsout;
}

@fragment fn fs(
  vs: VSOutput
) -> @location(0) vec4f {
  return vec4f(vs.texCoord, 0.0, 1.0);
}
